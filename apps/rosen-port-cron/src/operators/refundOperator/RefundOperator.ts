import { Refund, RefundStatus, RosenPortDBClient } from '@rosen-port/db';
import { IRefundOperator } from './types';
import { IWalletClient, PortExecutor } from '../../types/executor';
import {
  DBUpdateFailureException,
  NotImplementedException,
} from '@rosen-port/errors';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';
import { IRefundTxChecker } from './refundTxChecker';
import {
  FundsTo,
  MCPWallet,
  MultiChainPayment,
} from '@rosen-port/multi-chain-payment';
import { Networks } from '@rosen-port/chains';
import { IRosenUserInterface } from '@rosen/sdk';
import { RosenChainToken } from '@rosen-bridge/tokens';
import { IRefundStoreClient } from './storeClient';

export class RefundOperator extends PortExecutor implements IRefundOperator {
  refund: Refund;
  refundClient: IRefundStoreClient;
  refundTxId: string = '';
  rosenUI: IRosenUserInterface;
  refundTxChecker: IRefundTxChecker;

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
      throw new Error('Service fee has not been paid');
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
      throw new Error('Refund not valid');
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
    const rosenPortWalletAddress = await this.getPortWallet(
      container.sourceChain
    );
    const tokenId = container.tokenType.tokenId;
    const rosenChainToken: RosenChainToken =
      this.rosenUI.getTokenDetailsOnTargetChain(
        container.sourceChain,
        tokenId,
        container.destChain
      );

    // @ts-ignore
    const network = Networks[refund.container.destChain];
    const fundsTo: FundsTo = {
      token: rosenChainToken[container.destChain],
      // Note: The tx.amount from Tx is the exact amount transferred
      // that has taken decimals into account.
      decimalAmount: refund.txToRefund.amount,
      toAddress: refund.txToRefund.destAddress,
    };

    // 2bii. create MCPWallet to send funds back
    const unsignedTx = await MultiChainPayment.sendTo({
      network,
      sourceAddress: rosenPortWalletAddress.walletAddress,
      to: fundsTo,
    });

    Logger.info(
      '',
      CronCategory.RefundOperator,
      `[RefundOperator] Created unsignedTx ${unsignedTx}`
    );

    // create Wallet
    // @ts-ignore
    const walletMnemonic = MNEMONIC[container.destChain];
    const wallet = MCPWallet.create({ network, mnemonic: walletMnemonic });
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
   *
   * @param txId TxId to refund
   * @returns
   */
  async updateRefundTxInDb(
    txId: string,
    refundedTxId: string
  ): Promise<boolean> {
    const dbUpdated = await this.refundClient.updateRefund(
      txId,
      refundedTxId,
      RefundStatus.refund_in_process
    );

    if (dbUpdated !== null) {
      return true;
    }

    const failureMessage: string = `[RefundOperator] update refundedTx failed, Transaction to refund ${txId}, refundedTxId ${refundedTxId}`;

    Logger.error('', CronCategory.RefundOperator, failureMessage, {
      txIdToRefund: txId,
      refundedTxId: refundedTxId,
    });
    throw new DBUpdateFailureException(failureMessage);
  }
}
