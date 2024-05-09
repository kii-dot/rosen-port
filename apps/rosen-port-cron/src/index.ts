import * as cron from 'node-cron';
import { dbClient } from './tools/db';
import { ContainerStatus, TxStatus } from '@rosen-port/db';
import { TokenMap } from '@rosen-bridge/tokens';
import { MultiChainPayment, FundsTo } from '@rosen-port/multi-chain-payment';
import { Networks } from '@rosen-port/chains';
import tokens from '../tokens.json' assert { type: 'json' };

/**
 * Change this to 30 minutes
 */
const rosenPortWalletAddress =
  '9hrT4Kt8R4NAJoYiHZ6Cnpo4BcGLA32S58UjckJSxAcRF1xUops';

cron.schedule('*/1 * * * * *', async () => {
  console.log('Start cron');
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

    containers.forEach(async (container) => {
      const txs = await dbClient.tx.getContainerTxs(container.id);
      const to: Array<FundsTo> = [];
      const token = container.tokenType.tokenId;
      const rosenChainTokens = tokenMap.search(container.destChain, {
        tokenId: token,
      });
      txs.forEach(async (tx) => {
        if (tx.txStatus === TxStatus.bridged) {
          const fundsTo = {
            token: rosenChainTokens[0][container.destChain],
            decimalAmount: tx.amount / 1000000000,
            toAddress: tx.destAddress,
          };
          console.log(fundsTo);
          to.push(fundsTo);
        }
      });

      console.log(container.destChain);
      const unsignedTx = await MultiChainPayment.disperse({
        // @ts-ignore
        network: Networks[container.destChain],
        sourceAddress: rosenPortWalletAddress,
        to,
      });
      console.log(unsignedTx);
    });
  } catch (error) {
    console.log(error);
  }

  // Run a runner where it Refunds
  // 1. Check for Tx that needs to be refunded
  // 2. Check to see if the refund-fee has been confirmed
  // 3. Send funds from Rosen-port wallet to source wallet.
});
