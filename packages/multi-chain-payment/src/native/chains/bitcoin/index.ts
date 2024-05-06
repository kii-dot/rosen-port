import { FundsTo, IChainTx } from '../../../types/ChainTxs';
import { UnsignedErgoTxProxy } from '@rosen-ui/wallet-api';
import { UnsignedPsbtData } from '@rosen-port/chains';
import { NotImplementedException } from '@rosen-port/errors';

export class BitcoinChainTx implements IChainTx {
  async connect(): Promise<boolean> {
    return true;
  }

  async generateDisperseUnsignedTxs(
    to: Array<FundsTo>
  ): Promise<Array<string | UnsignedErgoTxProxy | UnsignedPsbtData>> {
    throw new NotImplementedException();
  }

  async generateTransferUnsignedTx(to: FundsTo): Promise<any> {
    throw new NotImplementedException();
  }
}
