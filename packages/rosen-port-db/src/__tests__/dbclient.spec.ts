import { RosenPortDBClient } from '@rosen-port/db';
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
    const userTxs = await dbClient.tx.getUserTxs(
      '9hrT4Kt8R4NAJoYiHZ6Cnpo4BcGLA32S58UjckJSxAcRF1xUops'
    );
    const containers = await dbClient.container.getContainers();
    containers.forEach(async (container) => {
      const txs = await dbClient.tx.getContainerTxs(container.id);
    });
  });
});
