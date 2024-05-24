import {
  ErgoExplorerAPI,
  ErgoExplorerUrl,
  ErgoNetwork,
} from '@rosen-port/ergo-explorer-node';

export class ExplorersFactory {
  static getExplorers(network: string, isMainNet: boolean = true) {
    switch (network) {
      case 'ergo':
        return new ErgoExplorerAPI(
          ErgoExplorerUrl.getDefault(),
          isMainNet ? ErgoNetwork.mainnet : ErgoNetwork.testnet
        );
      default:
        throw Error('network not implemented');
    }
  }
}
