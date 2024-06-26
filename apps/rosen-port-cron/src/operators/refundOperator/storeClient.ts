import { Refund, RefundStatus, RosenPortDBClient } from '@rosen-port/db';

export interface IRefundStoreClient {
  updateRefund(
    txIdToRefund: string,
    refundedTxId: string,
    refundStatus: RefundStatus
  ): Promise<Refund>;

  getRefundStatus(txIdToRefund: string): Promise<RefundStatus>;
}

export class RefundStoreClient implements IRefundStoreClient {
  dbClient: RosenPortDBClient;
  constructor(dbClient: RosenPortDBClient) {
    this.dbClient = dbClient;
  }

  async updateRefund(
    txIdToRefund: string,
    refundedTxId: string,
    refundStatus: RefundStatus
  ): Promise<Refund> {
    return await this.dbClient.refund.updateRefund(
      txIdToRefund,
      refundedTxId,
      refundStatus
    );
  }

  async getRefundStatus(txIdToRefund: string): Promise<RefundStatus> {
    return (await this.dbClient.refund.getRefundById(txIdToRefund)).status;
  }
}
