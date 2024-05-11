import * as cron from 'node-cron';
import { dbClient } from './tools/db';
import { ContainerStatus, TxStatus } from '@rosen-port/db';
import { TokenMap } from '@rosen-bridge/tokens';
import {
  MultiChainPayment,
  FundsTo,
  MCPWallet,
} from '@rosen-port/multi-chain-payment';
import { Networks } from '@rosen-port/chains';
import tokens from '../tokens.json' assert { type: 'json' };
import { MNEMONIC } from './constants/mnemonicConstants';

/**
 * Cron Job needed:
 * 1. Disperse of funds
 * 2. Bridging of funds
 * 3. Checking of Bridged funds
 * 4. Refunds of unbridged funds
 */

/**
 * Change this to 30 minutes
 */
cron.schedule('*/30 * * * * *', async () => {
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
      const rosenPortWalletAddress = await dbClient.wallet.getWallet(
        container.destChain
      );
      console.log(rosenPortWalletAddress.walletAddress);
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

      // @ts-ignore
      const network = Networks[container.destChain];
      const unsignedTx = await MultiChainPayment.disperse({
        network,
        sourceAddress: rosenPortWalletAddress.walletAddress,
        to,
      });
      console.log(unsignedTx);

      // create Wallet
      // @ts-ignore
      const walletMnemonic = MNEMONIC[container.destChain];
      const wallet = MCPWallet.create({ network, mnemonic: walletMnemonic });

      // Sign and send txs
      const tx = await wallet.signAndSubmit(unsignedTx);
      console.log(tx);

      // Update DB to sent and tx id
    });
  } catch (error) {
    console.log(error);
  }

  // Run a runner where it Refunds
  // 1. Check for Tx that needs to be refunded
  // 2. Check to see if the refund-fee has been confirmed
  // 3. Send funds from Rosen-port wallet to source wallet.
});
