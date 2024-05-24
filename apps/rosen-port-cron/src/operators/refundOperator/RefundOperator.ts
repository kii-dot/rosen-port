import {
  Container,
  Refund,
  RefundStatus,
  RosenPortDBClient,
  Wallet,
} from '@rosen-port/db';
import { IRefundOperator } from './types';
import { Executor } from '../../types/executor';
import { NotImplementedException } from '@rosen-port/errors';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';
import { RefundTxChecker } from './refundTxChecker';
import {
  FundsTo,
  MCPWallet,
  MultiChainPayment,
} from '@rosen-port/multi-chain-payment';
import { TokenMap } from '@rosen-bridge/tokens';
import { Networks } from '@rosen-port/chains';

export class RefundOperator extends Executor implements IRefundOperator {
  refund: Refund;
  db: RosenPortDBClient;
  refundTxId: string = '';
  tokenMap: TokenMap;

  constructor(refund: Refund, dbClient: RosenPortDBClient, tokenMap: TokenMap) {
    super();
    this.tokenMap = tokenMap;
    this.refund = refund;
    this.db = dbClient;
  }

  /**
   * Start the refund process.
   * 1. Pull all refunded tx
   * 2. Check if the service fee is paid
   * 3. Check if refund is valid
   * 4. refund
   * @returns nothing
   */
  async onExecute(): Promise<void> {
    try {
      this.refundTxId = await this.refundTx();

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
    const isServiceFeePaid = await this.checkServiceFeeTxStatus(
      this.refund.serviceFeeTxId,
      this.refund.container.sourceChain
    );

    if (!isServiceFeePaid) {
      throw new Error('Service fee has not been paid');
    }

    const isRefundValid = await this.checkRefundValid(
      this.refund.txToRefund.initiatedTxId
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
  async refundTx(): Promise<string> {
    const container = this.refund.container;
    const rosenPortWalletAddress = await this.getPortWallet(container);
    const token = container.tokenType.tokenId;
    const rosenChainTokens = this.tokenMap.search(container.sourceChain, {
      tokenId: token,
    });
    // @ts-ignore
    const network = Networks[this.refund.container.destChain];
    const fundsTo: FundsTo = {
      token: rosenChainTokens[0][container.destChain],
      // @todo kii this decimalAmount is wrong.
      decimalAmount: this.refund.txToRefund.amount / 1000000000,
      toAddress: this.refund.txToRefund.destAddress,
    };

    // 2bii. create MCPWallet to send funds back
    const unsignedTx = await MultiChainPayment.sendTo({
      network,
      sourceAddress: rosenPortWalletAddress.walletAddress,
      to: fundsTo,
    });

    // create Wallet
    // @ts-ignore
    const walletMnemonic = MNEMONIC[container.destChain];
    const wallet = MCPWallet.create({ network, mnemonic: walletMnemonic });
    const tx: string = await wallet.signAndSubmit(unsignedTx);
    return tx;
  }

  /**
   * Checks to see if the service fee has been paid for the
   * refund to begin processing
   *
   * @param serviceFeeTxId txId of the service fee payment
   * @returns true represents confirmed, false represents unconfirmed
   */
  async checkServiceFeeTxStatus(
    serviceFeeTxId: string,
    network: string
  ): Promise<boolean> {
    return await RefundTxChecker.check(serviceFeeTxId, network);
  }

  /**
   * Checks if a tx is valid for refund purposes. If its valid, the
   * refund can be processed. If it is not, the refund will not be
   * processed.
   *
   * What makes a refund INvalid?
   * 1. If it has already been refunded
   *
   * @param txId txId of the tx to be refunded
   * @returns true represents valid for refund, false means not valid
   *          for refund
   */
  async checkRefundValid(txId: string): Promise<boolean> {
    throw new NotImplementedException();
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
    const dbUpdated = this.db.refund.updateRefund(
      txId,
      refundedTxId,
      RefundStatus.refund_in_process
    );

    if (dbUpdated !== null) {
      return true;
    }

    return false;
  }

  async getPortWallet(container: Container): Promise<Wallet> {
    const rosenPortWalletAddress = await this.db.wallet.getWallet(
      container.destChain
    );

    return rosenPortWalletAddress;
  }
}
