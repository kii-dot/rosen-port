import { RosenPortDBClient, TxStatus } from '@rosen-port/db';
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
    const wallet = await dbClient.tx.updateTxStatus(
      '94df75d1b0e1d73e611acc677317fee24dadac2aef10903ade4046ef5f93f062',
      TxStatus.sent
    );
    console.log(wallet);
  });
});
