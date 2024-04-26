import { Networks } from '../constants';
import { IChainTx } from '../types/ChainTxs';
import { UnsignedPsbtData } from '../types/BitcoinTxTypes';
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
export class MultiChainPayment implements IMultiChainPayment {
  async sendTo({
    network,
    amount,
    tokenType,
    paymentAddress,
  }: {
    network: keyof typeof Networks;
    amount: number;
    tokenType: RosenChainToken;
    sourceAddress: string;
    paymentAddress: string;
  }): Promise<string | UnsignedPsbtData | UnsignedErgoTxProxy> {
    const chainTx: IChainTx = ChainTxFactory.getChainTx(network);
    return await chainTx.generateUnsignedTransferTx(
      tokenType,
      amount,
      paymentAddress
    );
  }
}
