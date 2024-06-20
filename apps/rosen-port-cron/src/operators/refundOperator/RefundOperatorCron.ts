import { CronCategory } from '../../constants/cronConstants';
import { Refund, RefundStatus, RosenPortDBClient } from '@rosen-port/db';
import { RefundOperator } from './RefundOperator';
import { RosenPortCronExecutor } from '../../cron/RosenPortCronExecutor';
import { RefundStoreClient } from './storeClient';
import { RosenUserInterface } from '@rosen/sdk';
import { RefundTxChecker } from './refundTxChecker';
import { WalletClient } from '../../types/executor';

// Run a runner where it Refunds
// 1. Check for Tx that needs to be refunded
// 2. Check to see if the refund-fee has been confirmed
// 3. Send funds from Rosen-port wallet to source wallet.
export class RefundOperatorCronExecutor extends RosenPortCronExecutor {
  rosenUI: RosenUserInterface;
  dbClient: RosenPortDBClient;
  constructor(
    cronTimeString: string,
    rosenUI: RosenUserInterface,
    dbClient: RosenPortDBClient
  ) {
    super(cronTimeString, CronCategory.RefundOperator);
    this.rosenUI = rosenUI;
    this.dbClient = dbClient;
  }

  async getValidRefunds(): Promise<Refund[]> {
    return await this.dbClient.refund.getRefundByStatus(
      RefundStatus.refund_service_fee_signed
    );
  }

  async execute(): Promise<void> {
    // 1. Get refundTxs that have service fee paid
    const refunds = await this.getValidRefunds();
    const refundStoreClient = new RefundStoreClient(this.dbClient);
    const refundTxChecker = new RefundTxChecker();
    const walletClient = new WalletClient(this.dbClient);

    // 2. For each refunds
    refunds.forEach((refund) => {
      const refundOperator = new RefundOperator(
        refund,
        refundStoreClient,
        this.rosenUI,
        refundTxChecker,
        walletClient
      );
      refundOperator.execute();
    });
  }
}
