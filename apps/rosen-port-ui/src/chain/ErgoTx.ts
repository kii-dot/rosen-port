import { EIP12UnsignedTransaction } from '@fleet-sdk/common';
import { Txs } from './Txs';
import { ExplorerAPI } from './ergo/explorer-api';
import { NodeAPI } from './ergo/node-api';

export class ErgoTxs implements Txs {
  explorer: ExplorerAPI;
  node: NodeAPI;
  constructor({ explorerUrl, nodeUrl }: { explorerUrl: string; nodeUrl: string }) {
    this.explorer = new ExplorerAPI(explorerUrl);
    this.node = new NodeAPI(nodeUrl);
  }

  sendTo(amount: bigint, walletAddress: string): EIP12UnsignedTransaction {}
}
