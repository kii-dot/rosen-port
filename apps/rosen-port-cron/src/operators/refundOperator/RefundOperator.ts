import { Refund, RefundStatus } from '@rosen-port/db';
import { IRefundOperator } from './types';
import { Executor } from '../../types/executor';
import { dbClient } from '../../tools/db';
import { DBClient } from '@rosen-port/db/dist/src/dbClient';
import { NotImplementedException } from '@rosen-port/errors';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';

export class RefundOperator extends Executor implements IRefundOperator {
  refund: Refund;
  db: DBClient;
  refundSuccessful: boolean = false;

  constructor(refund: Refund, dbClient: DBClient) {
    super();
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
      this.refundSuccessful = await this.refundTx(this.refund.txIdToRefund);

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
   *
   */
  async onBeforeExecute(): Promise<void> {
    const isServiceFeePaid = await this.checkServiceFeeTxStatus(
      this.refund.serviceFeeTxId
    );

    if (!isServiceFeePaid) {
      throw new Error('Service fee has not been paid');
    }

    await this.checkRefundValid(this.refund.txIdToRefund);
  }

  /**
   * If refund is successful, update in DB
   */
  async onAfterExecute(): Promise<void> {
    await this.updateRefundTxInDb(this.refund.txIdToRefund);
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
  async refundTx(txId: string): Promise<boolean> {
    throw new Error('Not Implemented');
  }

  /**
   * Checks to see if the service fee has been paid for the
   * refund to begin processing
   *
   * @param serviceFeeTxId txId of the service fee payment
   * @returns true represents confirmed, false represents unconfirmed
   */
  async checkServiceFeeTxStatus(serviceFeeTxId: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  /**
   * Checks if a tx is valid for refund purposes. If its valid, the
   * refund can be processed. If it is not, the refund will not be
   * processed.
   *
   * @param txId txId of the tx to be refunded
   * @returns true represents valid for refund, false means not valid
   *          for refund
   */
  async checkRefundValid(txId: string): Promise<boolean> {
    throw new NotImplementedException();
  }

  async updateRefundTxInDb(txId: string): Promise<boolean> {
    const dbUpdated = this.db.refund.updateRefundStatus(
      this.refund.txIdToRefund,
      RefundStatus.refund_in_process
    );

    if (dbUpdated !== null) {
      return true;
    }

    return false;
  }
}
