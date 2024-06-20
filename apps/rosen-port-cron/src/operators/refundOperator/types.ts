import { Refund } from '@rosen-port/db';

/**
 * Interface for tool to process refunds
 */
export interface IRefundOperator {
  /**
   * Refunds the tx where a refund request has been triggered.
   * Pulls information from the db for refund.
   * Its a send payment to source address of source network function.
   * NOTE: Checks are done in here.
   *
   * @returns true represents refund is processed, false means
   *          refund failed to be processed
   */
  refundTx: (refund: Refund) => Promise<string>;

  /**
   * Checks if a tx is valid for refund purposes. If its valid, the
   * refund can be processed. If it is not, the refund will not be
   * processed.
   *
   * @param txId txId of the tx to be refunded
   * @returns true represents valid for refund, false means not valid
   *          for refund
   */
  ensureRefundValid: (refund: Refund) => Promise<void>;

  updateRefundTxInDb: (txId: string, refundedTxId: string) => Promise<boolean>;
}
