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
   * @param txId id of the tx to be refunded
   * @returns true represents refund is processed, false means
   *          refund failed to be processed
   */
  refundTx: (txId: string) => Promise<boolean>;

  /**
   * Checks to see if the service fee has been paid for the
   * refund to begin processing
   *
   * @param serviceFeeTxId txId of the service fee payment
   * @returns true represents confirmed, false represents unconfirmed
   */
  checkServiceFeeTxStatus: (serviceFeeTxId: string) => Promise<boolean>;

  /**
   * Checks if a tx is valid for refund purposes. If its valid, the
   * refund can be processed. If it is not, the refund will not be
   * processed.
   *
   * @param txId txId of the tx to be refunded
   * @returns true represents valid for refund, false means not valid
   *          for refund
   */
  checkRefundValid: (txId: string) => Promise<boolean>;

  updateRefundTxInDb: (txId: string) => Promise<boolean>;
}
