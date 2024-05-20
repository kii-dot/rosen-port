import { FundsTo, IChainTx } from '../../../types/ChainTxs';
import { UnsignedPsbtData } from '@rosen-port/chains';
import { EIP12UnsignedTransaction } from '@fleet-sdk/common';
import { NotImplementedException } from '../../../../../rosen-commons/dist/src';

export class CardanoChainTx implements IChainTx {
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
