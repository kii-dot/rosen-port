import * as cron from 'node-cron';
import { dbClient } from '../../tools/db';
import { ContainerStatus } from '@rosen-port/db';
import { TokenMap } from '@rosen-bridge/tokens';
import tokens from '../../../tokens.json' assert { type: 'json' };
import { FundDistributor } from './FundDistributor';

export const fundDistributorCron = cron.schedule('*/30 * * * * *', async () => {
  console.log('[FundDistributorCron]: Start cron');
  const tokenMap = new TokenMap(tokens);
  // Run a runner where it Bridge
  // 1. Checks containers that are initiated on whether the amount is full.
  // 2a. If the amount is not filled -> sleep and wait
  // 2b. If the amount is filled -> send it to Rosen to bridge
  // 3. Update status of the containers
  try {
    const containers = await dbClient.container.getContainersViaStatus(
      ContainerStatus.bridged
    );

    const fundDistributor = new FundDistributor(tokenMap);
    containers.forEach(async (container) => {
      const isContainerBridged = await fundDistributor.isContainerBridged(
        container.id
      );
      if (isContainerBridged) {
        console.log('[FundDistributorCron]: Distribute funds start');
        const txId = await fundDistributor.distributeFunds(container);
        if (txId !== '') {
          console.log('[FundDistributorCron]: Funds Distributed');
        }
        console.log(
          '[FundDistributorCron]: Distributed funds with txId - ',
          txId
        );

        const isUpdatedDistributedTx =
          await fundDistributor.updateDistributedTx(txId);

        if (isUpdatedDistributedTx) {
          console.log('[FundDistributorCron]: TxId updated in DB');
        } else {
          console.log('[FundDistributorCron]: TxId update Failed');
        }
      } else {
        console.log('Container not bridged');
      }
    });
  } catch (error) {
    console.log('[FundDistributorCron]: Failed with:', error);
  }

  // Run a runner where it Refunds
  // 1. Check for Tx that needs to be refunded
  // 2. Check to see if the refund-fee has been confirmed
  // 3. Send funds from Rosen-port wallet to source wallet.
});
