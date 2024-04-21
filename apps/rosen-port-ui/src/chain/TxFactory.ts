import { EXPLORER_URL, NODE_URL } from '#/constants/envConstants';
import { ChainDoesNotExistError, ChainError } from '#/errors/ChainErrors';
import { ErgoTxs } from './ErgoTx';

export enum Chain {
  ergo = 'ergo',
  cardano = 'cardano',
}

export const TxFactory = (chain: string) => {
  switch (chain) {
    case Chain.cardano:
    //   return new CardanoTxs();
    case Chain.ergo:
      return new ErgoTxs({ explorerUrl: EXPLORER_URL, nodeUrl: NODE_URL });
    default:
      throw new ChainDoesNotExistError(null);
  }
};
