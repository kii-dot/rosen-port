import { Networks } from '../../constants';
import { ChainNotImplementedError } from '../../error/ChainTxErrors';
import { IChainTx } from '../../types/ChainTxs';
import { BitcoinChainTx } from './bitcoin';
import { CardanoChainTx } from './cardano';
import { ErgoChainTx } from './ergo';

export class ChainTxFactory {
  static getChainTx(network: keyof typeof Networks): IChainTx {
    switch (network) {
      case Networks.ergo:
        return new ErgoChainTx();
      case Networks.cardano:
        return new CardanoChainTx();
      case Networks.bitcoin:
        return new BitcoinChainTx();
      default:
        throw new ChainNotImplementedError(network);
    }
  }
}
