import { RefundStatus } from '@rosen-port/db';
import {
  ergoPortWallet,
  ergoRefundServiceFee,
} from '../../constants/feeConstants';
import { ExplorersFactory } from '../../tools/explorer';
import { IRefundStoreClient } from './storeClient';
import { NotImplementedException } from '@rosen-port/errors';

export interface IRefundTxChecker {
  /**
   * Checks to see if the service fee has been paid for the
   * refund to begin processing
   *
   * @param serviceFeeTxId txId of the service fee payment
   * @returns true represents confirmed, false represents unconfirmed
   */
  isServiceFeeConfirmed(
    serviceFeeTxId: string,
    network: string
  ): Promise<boolean>;

  /**
   *
   * Checks if a tx is valid for refund purposes. If its valid, the
   * refund can be processed. If it is not, the refund will not be
   * processed.
   *
   * What makes a refund valid?
   * 1. If it has NOT been refunded yet
   * 2. If it has been confirmed on source chain
   * 3. If it has NOT been bridged
   *
   * This however, is done based on the statusChecker which is the
   * oracle for us. So we will only check the "Oracle", or db, to
   * get the results
   *
   * @param txId txId of the tx to be refunded
   * @returns true represents valid for refund, false means not valid
   *          for refund
   */
  isRefundValid(txId: string): Promise<boolean>;
}

export class RefundTxChecker implements IRefundTxChecker {
  refundStoreClient: IRefundStoreClient;
  constructor(refundStoreClient: IRefundStoreClient) {
    this.refundStoreClient = refundStoreClient;
  }

  /**
   *
   * Checks if a tx is valid for refund purposes. If its valid, the
   * refund can be processed. If it is not, the refund will not be
   * processed.
   *
   * What makes a refund valid?
   * 1. If it has NOT been refunded yet
   * 2. If it has been confirmed on source chain
   * 3. If it has NOT been bridged
   *
   * This however, is done based on the statusChecker which is the
   * oracle for us. So we will only check the "Oracle", or db, to
   * get the results
   *
   * @param txId txId of the tx to be refunded
   * @returns true represents valid for refund, false means not valid
   *          for refund
   */
  async isRefundValid(txId: string): Promise<boolean> {
    return (
      (await this.refundStoreClient.getRefundStatus(txId)) ===
      RefundStatus.refund_valid
    );
  }

  async isServiceFeeConfirmed(
    serviceFeeTxId: string,
    network: string
  ): Promise<boolean> {
    switch (network) {
      case 'ergo':
        return await this.ergoNetworkCheck(serviceFeeTxId);
      case 'cardano':
        return await this.cardanoNetworkCheck(serviceFeeTxId);
      default:
        return false;
    }
  }

  async ergoNetworkCheck(serviceFeeTxId: string): Promise<boolean> {
    const explorer = ExplorersFactory.getExplorers('ergo');
    const transaction = await explorer.getTransaction(serviceFeeTxId);
    if (
      transaction !== null &&
      transaction.numConfirmations > 3 &&
      transaction.outputs[0].value >= ergoRefundServiceFee &&
      transaction.outputs[0].address === ergoPortWallet
    ) {
      return true;
    } else {
      return false;
    }
  }

  async cardanoNetworkCheck(serviceFeeTxId: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
