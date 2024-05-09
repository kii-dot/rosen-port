import { IChainTx, FundsTo } from '../types/ChainTxs';
import { UnsignedPsbtData, Networks } from '@rosen-port/chains';
import { ChainTxFactory } from './chains/ChainTxFactory';
import { ErgoUnsignedTransaction } from '@fleet-sdk/core';

interface IMultiChainPayment {
  sendTo: ({
    network,
    sourceAddress,
    to,
  }: {
    network: keyof typeof Networks;
    sourceAddress: string;
    to: FundsTo;
  }) => Promise<string | UnsignedPsbtData | ErgoUnsignedTransaction>;

  disperse: ({
    network,
    to,
    sourceAddress,
  }: {
    network: keyof typeof Networks;
    sourceAddress: string;
    to: Array<FundsTo>;
  }) => Promise<string | UnsignedPsbtData | ErgoUnsignedTransaction>;
}

/**
 * MultiChainPayment
 *
 * This class focuses on creating the send txs required for a certain
 * chain.
 */
@staticImplements<IMultiChainPayment>()
export class MultiChainPayment {
  static async sendTo({
    network,
    sourceAddress,
    to,
  }: {
    network: keyof typeof Networks;
    sourceAddress: string;
    to: FundsTo;
  }): Promise<string | UnsignedPsbtData | ErgoUnsignedTransaction> {
    const chainTx: IChainTx = ChainTxFactory.getChainTx(sourceAddress, network);
    return await chainTx.generateTransferUnsignedTx(to);
  }

  static async disperse({
    network,
    sourceAddress,
    to,
  }: {
    network: keyof typeof Networks;
    sourceAddress: string;
    to: Array<FundsTo>;
  }): Promise<string | UnsignedPsbtData | ErgoUnsignedTransaction> {
    const chainTx: IChainTx = ChainTxFactory.getChainTx(sourceAddress, network);
    return await chainTx.generateDisperseUnsignedTxs(to);
  }
}

function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}
