import { IChainTx, FundsTo } from '../types/ChainTxs';
import { UnsignedPsbtData, Networks } from '@rosen-port/chains';
import { ChainTxFactory } from './chains/ChainTxFactory';
import { EIP12UnsignedTransaction } from '@fleet-sdk/common';

export interface IMultiChainPayment {
  sendTo: (
    sourceAddress: string,
    to: FundsTo
  ) => Promise<string | UnsignedPsbtData | EIP12UnsignedTransaction>;

  disperse: (
    sourceAddress: string,
    to: Array<FundsTo>
  ) => Promise<string | UnsignedPsbtData | EIP12UnsignedTransaction>;
}

/**
 * MultiChainPayment
 *
 * This class focuses on creating the send txs required for a certain
 * chain.
 */
export class MultiChainPayment implements IMultiChainPayment {
  network: keyof typeof Networks;
  constructor(network: keyof typeof Networks) {
    this.network = network;
  }

  async sendTo(
    sourceAddress: string,
    to: FundsTo
  ): Promise<string | UnsignedPsbtData | EIP12UnsignedTransaction> {
    const chainTx: IChainTx = ChainTxFactory.getChainTx(
      sourceAddress,
      this.network
    );
    return await chainTx.generateTransferUnsignedTx(to);
  }

  async disperse(
    sourceAddress: string,
    to: FundsTo[]
  ): Promise<string | UnsignedPsbtData | EIP12UnsignedTransaction> {
    const chainTx: IChainTx = ChainTxFactory.getChainTx(
      sourceAddress,
      this.network
    );
    return await chainTx.generateDisperseUnsignedTxs(to);
  }
}
