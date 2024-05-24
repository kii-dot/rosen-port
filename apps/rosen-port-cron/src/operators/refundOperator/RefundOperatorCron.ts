import { CronCategory } from '../../constants/cronConstants';
import { dbClient } from '../../tools/db';
import { Refund, RefundStatus } from '@rosen-port/db';
import { RefundOperator } from './RefundOperator';
import { RosenPortCronExecutor } from '../../cron/RosenPortCronExecutor';
import { tokenMap } from '../../tools/tokenMap';

// Run a runner where it Refunds
// 1. Check for Tx that needs to be refunded
// 2. Check to see if the refund-fee has been confirmed
// 3. Send funds from Rosen-port wallet to source wallet.
export class RefundOperatorCronExecutor extends RosenPortCronExecutor {
  constructor(cronTimeString: string) {
    super(cronTimeString, CronCategory.RefundOperator);
  }

  async getValidRefunds(): Promise<Refund[]> {
    return await dbClient.refund.getRefundByStatus(
      RefundStatus.refund_service_fee_signed
    );
  }

  async execute(): Promise<void> {
    // 1. Get refundTxs that have service fee paid
    const refunds = await this.getValidRefunds();

    // 2. For each refunds
    refunds.forEach((refund) => {
      const refundOperator = new RefundOperator(refund, dbClient, tokenMap);
      refundOperator.execute();
    });
  }
}
