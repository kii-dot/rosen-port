import { IChainTx } from '../types/ChainTxs';
import { UnsignedPsbtData, Networks } from '@rosen-port/chains';
import { RosenChainToken } from '@rosen-bridge/tokens';
import { ChainTxFactory } from './chains/ChainTxFactory';
import { UnsignedErgoTxProxy } from '@rosen-ui/wallet-api';

interface IMultiChainPayment {
  sendTo: ({
    network,
    amount,
    tokenType,
    sourceAddress,
    paymentAddress,
  }: {
    network: keyof typeof Networks;
    amount: number;
    tokenType: RosenChainToken;
    sourceAddress: string;
    paymentAddress: string;
  }) => Promise<string | UnsignedPsbtData | UnsignedErgoTxProxy>;
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
    amount,
    tokenType,
    sourceAddress,
    paymentAddress,
  }: {
    network: keyof typeof Networks;
    amount: number;
    tokenType: RosenChainToken;
    sourceAddress: string;
    paymentAddress: string;
  }): Promise<string | UnsignedPsbtData | UnsignedErgoTxProxy> {
    const chainTx: IChainTx = ChainTxFactory.getChainTx(network);
    return await chainTx.generateTransferUnsignedTx({
      token: tokenType,
      decimalAmount: amount,
      toAddress: paymentAddress,
    });
  }
}

function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}
