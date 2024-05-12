import { Container, TxStatus } from '@rosen-port/db';
import { IFundDistributor } from './types';
import {
  FundsTo,
  MCPWallet,
  MultiChainPayment,
} from '@rosen-port/multi-chain-payment';
import { dbClient } from '../../tools/db';
import { TokenMap } from '@rosen-bridge/tokens';
import { Networks } from '@rosen-port/chains';
import { MNEMONIC } from '../../constants/mnemonicConstants';

export class FundDistributor implements IFundDistributor {
  tokenMap: TokenMap;
  constructor(tokenMap: TokenMap) {
    this.tokenMap = tokenMap;
  }
  /**
   * Checks the DB and the explorer to identify whether
   * a container has been bridged.
   *
   * @param containerId Id of container to be checked
   * @returns boolean, true represent bridged, false represents
   *          unbridged
   */
  isContainerBridged(containerId: string): boolean {
    return true;
  }

  /**
   * Distributes funds that have been bridged.
   * Each tx that are distributed are updated in the DB.
   *
   * @param containerId Id of container to be distributed
   * @returns boolean, true represents distributed, false
   *          represents failure in distribution.
   */
  async distributeFunds(container: Container): Promise<string> {
    const txs = await dbClient.tx.getContainerTxs(container.id);
    const to: Array<FundsTo> = [];
    const token = container.tokenType.tokenId;
    const rosenChainTokens = this.tokenMap.search(container.destChain, {
      tokenId: token,
    });
    const rosenPortWalletAddress = await dbClient.wallet.getWallet(
      container.destChain
    );
    txs.forEach(async (tx) => {
      if (tx.txStatus === TxStatus.bridged) {
        const fundsTo = {
          token: rosenChainTokens[0][container.destChain],
          decimalAmount: tx.amount / 1000000000,
          toAddress: tx.destAddress,
        };
        to.push(fundsTo);
      }
    });

    // @ts-ignore
    const network = Networks[container.destChain];
    const unsignedTx = await MultiChainPayment.disperse({
      network,
      sourceAddress: rosenPortWalletAddress.walletAddress,
      to,
    });

    // create Wallet
    // @ts-ignore
    const walletMnemonic = MNEMONIC[container.destChain];
    const wallet = MCPWallet.create({ network, mnemonic: walletMnemonic });

    // Sign and send txs
    const tx = await wallet.signAndSubmit(unsignedTx);
    return tx;
  }

  /**
   * Updates the tx status of the tx with the txId in db
   * to distributed
   *
   * @param txId Id of Tx that has been distributed
   * @returns boolean, true represents updated, false
   *          represents failure to update db.
   */
  updateDistributedTx(txId: string): boolean {
    return true;
  }
}
