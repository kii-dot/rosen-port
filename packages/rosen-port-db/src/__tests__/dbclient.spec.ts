import { RefundStatus, RosenPortDBClient, TxStatus } from '@rosen-port/db';
import dotenv from 'dotenv';
dotenv.config();

export const dbClient = new RosenPortDBClient(
  process.env.PUBLIC_ENV__SUPABASE_URL !== undefined
    ? process.env.PUBLIC_ENV__SUPABASE_URL
    : '',
  process.env.PUBLIC_ENV__SUPABASE_KEY !== undefined
    ? process.env.PUBLIC_ENV__SUPABASE_KEY
    : ''
);

describe('dbclient', () => {
  it('should get boxes', async () => {
    const wallet = await dbClient.refund.getRefundByStatus(
      RefundStatus.refund_initiated
    );
    console.log(wallet);
  });
});
