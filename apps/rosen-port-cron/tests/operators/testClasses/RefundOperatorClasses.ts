import { Refund, RefundStatus } from '@rosen-port/db';
import { IRefundStoreClient } from '../../../src/operators/refundOperator/storeClient';
import { refunds } from '../mock';
import { IRefundTxChecker } from '../../../src/operators/refundOperator/refundTxChecker';

export class TestRefundStoreClient implements IRefundStoreClient {
  private refundStore: Map<string, Refund>;

  constructor() {
    this.refundStore = new Map(); // Initializes a map to store Refund objects keyed by transaction ID.
  }

  async updateRefund(
    txIdToRefund: string,
    refundedTxId: string,
    refundStatus: RefundStatus
  ): Promise<Refund> {
    // Retrieve the refund by the transaction ID to refund.
    const refund = this.refundStore.get(txIdToRefund);
    if (!refund) {
      throw new Error(`No refund found for transaction ID: ${txIdToRefund}`);
    }
    // Update the status and refund transaction ID.
    refund.status = refundStatus;
    refund.refundTxId = refundedTxId;

    // Update the map with the new refund details.
    this.refundStore.set(txIdToRefund, refund);

    return refund;
  }

  async getRefundStatus(txIdToRefund: string): Promise<RefundStatus> {
    // Retrieve the refund by the transaction ID to refund.
    const refund = this.refundStore.get(txIdToRefund);
    if (!refund) {
      throw new Error(`No refund found for transaction ID: ${txIdToRefund}`);
    }
    return refund.status;
  }

  // Method to add refunds to the store for testing purposes.
  addRefund(refund: Refund) {
    this.refundStore.set(refund.txToRefund.initiatedTxId, refund);
  }
}

export class TestRefundStoreClientFactory {
  static generate(): TestRefundStoreClient {
    const testClient = new TestRefundStoreClient();

    refunds.forEach((refund) => {
      testClient.addRefund(refund);
    });

    return testClient;
  }
}

export class TestRefundTxChecker implements IRefundTxChecker {
  refundStoreClient: IRefundStoreClient;
  constructor(refundStoreClient: IRefundStoreClient) {
    this.refundStoreClient = refundStoreClient;
  }

  async isRefundValid(txId: string): Promise<boolean> {
    const isValid =
      (await this.refundStoreClient.getRefundStatus(txId)) ===
      RefundStatus.refund_valid;
    return isValid;
  }

  async isServiceFeeConfirmed(
    serviceFeeTxId: string,
    network: string
  ): Promise<boolean> {
    return true;
  }
}
