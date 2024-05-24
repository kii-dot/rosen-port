import { FundsTo, IChainTx } from '../../../types/ChainTxs';
import { UnsignedPsbtData } from '@rosen-port/chains';
import { NotImplementedException } from '../../../../../rosen-commons/dist/src';
import { EIP12UnsignedTransaction } from '@fleet-sdk/common';

export class BitcoinChainTx implements IChainTx {
  async connect(): Promise<boolean> {
    return true;
  }

  generateDisperseUnsignedTxs: (
    to: FundsTo[]
  ) => Promise<string | EIP12UnsignedTransaction | UnsignedPsbtData>;

  async generateTransferUnsignedTx(to: FundsTo): Promise<any> {
    throw new NotImplementedException();
  }
}
