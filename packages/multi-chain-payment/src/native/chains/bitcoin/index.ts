import { FundsTo, IChainTx } from '../../../types/ChainTxs';
import { UnsignedPsbtData } from '@rosen-port/chains';
import { NotImplementedException } from '@rosen-port/errors';
import { ErgoUnsignedTransaction } from '@fleet-sdk/core';

export class BitcoinChainTx implements IChainTx {
  async connect(): Promise<boolean> {
    return true;
  }

  generateDisperseUnsignedTxs: (
    to: FundsTo[]
  ) => Promise<string | ErgoUnsignedTransaction | UnsignedPsbtData>;

  async generateTransferUnsignedTx(to: FundsTo): Promise<any> {
    throw new NotImplementedException();
  }
}
