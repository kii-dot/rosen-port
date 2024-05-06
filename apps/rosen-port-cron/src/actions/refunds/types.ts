/**
 * Interface for tool to process refunds
 */
interface IRefunds {
    /**
     * Start the refund process.
     * 1. Pull all refunded tx
     * 2. Check if the service fee is paid
     * 3. Check if refund is valid
     * 4. refund
     * @returns nothing
     */
    refund: () => void

    /**
     * Retrieve all txs that needs to be refunded from DB
     * 
     * @returns RefundTxs type {
     *              txToRefund (
     *                  txId, 
     *                  txStatus, 
     *                  tokenType, 
     *                  amount,
     *                  sourceChain
     *              )
     *              serviceFeeTx,
     *              txStatus
     *          }
     */
    getAllRefundTx: () => [{}]

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
    refundTx: (txId: string) => boolean

    /**
     * Checks to see if the service fee has been paid for the
     * refund to begin processing
     * 
     * @param serviceFeeTxId txId of the service fee payment
     * @returns true represents confirmed, false represents unconfirmed
     */
    checkServiceFeeTxStatus: (serviceFeeTxId: string) => boolean
    
    /**
     * Checks if a tx is valid for refund purposes. If its valid, the
     * refund can be processed. If it is not, the refund will not be
     * processed.
     * 
     * @param txId txId of the tx to be refunded
     * @returns true represents valid for refund, false means not valid
     *          for refund
     */
    checkRefundValid: (txId: string) => boolean
}