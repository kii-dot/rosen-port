import { Refund, RefundStatus } from '@rosen-port/db';
import { IRefundOperator } from './types';
import { PortExecutor } from '../../types/executor';
import { DBUpdateFailureException } from '@rosen-port/errors';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';
import { IRefundTxChecker } from './refundTxChecker';
import { FundsTo, IMultiChainPayment } from '@rosen-port/multi-chain-payment';
import { Networks } from '@rosen-port/chains';
import { IRosenUserInterface } from '@rosen/sdk';
import { RosenChainToken } from '@rosen-bridge/tokens';
import { IRefundStoreClient } from './storeClient';
import {
  RefundInvalidException,
  RefundServiceFeeNotConfirmedException,
} from '../../errors/refundErrors';
import { IWalletClient } from '../utils/WalletClient';
import { getNetworks } from '../utils/networks';
import { getMnemonic } from '../../constants/mnemonicConstants';

export class RefundOperator extends PortExecutor implements IRefundOperator {
  refund: Refund;
  refundClient: IRefundStoreClient;
  refundTxId: string = '';
  rosenUI: IRosenUserInterface;
  refundTxChecker: IRefundTxChecker;
  sourceChainNetwork: keyof typeof Networks;

  constructor(
    refund: Refund,
    refundClient: IRefundStoreClient,
    rosenUI: IRosenUserInterface,
    refundTxChecker: IRefundTxChecker,
    walletClient: IWalletClient
  ) {
    super();
    this.rosenUI = rosenUI;
    this.refund = refund;
    this.refundClient = refundClient;
    this.refundTxChecker = refundTxChecker;
    this.walletClient = walletClient;
    // In Refund, everything is done on the source chain side.
    this.sourceChainNetwork = getNetworks(refund.container.sourceChain);
  }

  /**
   * Refunds the tx
   */
  async onExecute(): Promise<void> {
    try {
      this.refundTxId = await this.refundTx(this.refund);

      Logger.info(
        '0',
        CronCategory.RefundOperator,
        '[RefundOperator] Refund was successful'
      );
    } catch (error) {
      Logger.error(
        '0',
        CronCategory.RefundOperator,
        `[RefundOperator] Refund failed with error: ${error}`
      );
      throw error;
    }
  }

  /**
   * Checks to see if refund is possible
   * 1. Check to see if Tx has been refunded
   * 2. Check to see if ServiceFee is paid/confirmed
   */
  async onBeforeExecute(): Promise<void> {
    await this.ensureRefundValid(this.refund);
  }

  /**
   * If refund is successful, update in DB
   */
  async onAfterExecute(): Promise<void> {
    // 2biii. update refund db to refunded, and with refund txId.
    // @todo kii This CANNOT FAIL. how do we ensure that? or if it fail, how do we ensure it gets updated
    if (this.refundTxId !== '')
      await this.updateRefundTxInDb(
        this.refund.txToRefund.initiatedTxId,
        this.refundTxId
      );
  }

  async ensureRefundValid(refund: Refund): Promise<void> {
    const isServiceFeePaid = await this.refundTxChecker.isServiceFeeConfirmed(
      refund.serviceFeeTxId,
      refund.container.sourceChain
    );

    if (!isServiceFeePaid) {
      throw new RefundServiceFeeNotConfirmedException(
        `Refund ServiceFee unconfirmed: ${refund.id}`
      );
    }

    const isRefundValid = await this.refundTxChecker.isRefundValid(
      refund.txToRefund.initiatedTxId
    );

    if (!isRefundValid) {
      Logger.error(
        '0',
        CronCategory.RefundOperator,
        `[RefundOperator] Refund invalid`
      );
      throw new RefundInvalidException(`Refund Invalid: ${refund.id}`);
    }
  }

  /**
   * Refunds the tx where a refund request has been triggered.
   * Pulls information from the db for refund.
   * Its a send payment to source address of source network function.
   * NOTE: Checks are done in here.
   *
   * @param txId id of the tx to be refunded
   * @returns true represents refund is processed, false means
   *          refund failed to be processed
   */
  async refundTx(refund: Refund): Promise<string> {
    const container = refund.container;
    const rosenPortWalletAddress = await this.getPortWalletInfo(
      container.sourceChain
    );
    const tokenId = container.tokenType.tokenId;
    const rosenChainToken: RosenChainToken =
      this.rosenUI.getTokenDetailsOnTargetChain(
        container.sourceChain,
        tokenId,
        container.destChain
      );

    const fundsTo: FundsTo = {
      token: rosenChainToken[this.sourceChainNetwork],
      // Note: The tx.amount from Tx is the exact amount transferred
      // that has taken decimals into account.
      decimalAmount: refund.txToRefund.amount,
      // We're sending it back to the source
      toAddress: refund.txToRefund.sourceAddress,
    };
    // 2bii. create MCPWallet to send funds back
    this.walletClient.setNetwork(this.sourceChainNetwork);
    const multiChainPayment: IMultiChainPayment =
      this.walletClient.getMultiChainPayment();
    const unsignedTx = await multiChainPayment.sendTo(
      rosenPortWalletAddress.walletAddress,
      fundsTo
    );

    Logger.info(
      '',
      CronCategory.RefundOperator,
      `[RefundOperator] Created unsignedTx ${unsignedTx}`
    );

    // create Wallet
    const walletMnemonic = getMnemonic(this.sourceChainNetwork);
    const mcpWallet = this.walletClient.getMCPWallet();
    const wallet = mcpWallet.create(walletMnemonic);
    const walletAddress = await wallet.address();

    Logger.info(
      '',
      CronCategory.RefundOperator,
      `[RefundOperator] signing unsignedTx with wallet ${walletAddress}`
    );
    const tx: string = await wallet.signAndSubmit(unsignedTx);
    return tx;
  }

  /**
   * @param txIdToRefund TxId to refund
   * @param refundTxId the txId of the refund that was made
   * @returns
   */
  async updateRefundTxInDb(
    txIdToRefund: string,
    refundedTxId: string
  ): Promise<boolean> {
    const dbUpdated = await this.refundClient.updateRefund(
      txIdToRefund,
      refundedTxId,
      RefundStatus.refund_in_process
    );

    if (dbUpdated !== null) {
      return true;
    }

    const failureMessage: string =
      `[RefundOperator] update refundedTx failed, Transaction to ` +
      `refund ${txIdToRefund}, refundedTxId ${refundedTxId}`;

    Logger.error('', CronCategory.RefundOperator, failureMessage, {
      txIdToRefund: txIdToRefund,
      refundedTxId: refundedTxId,
    });
    throw new DBUpdateFailureException(failureMessage);
  }
}
