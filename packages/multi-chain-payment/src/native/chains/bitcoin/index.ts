import { FundsTo, IChainTx } from '../../../types/ChainTxs';
import { UnsignedErgoTxProxy } from '@rosen-ui/wallet-api';
import { UnsignedPsbtData } from '@rosen-port/chains';

export class BitcoinChainTx implements IChainTx {
  async connect(): Promise<boolean> {
    return true;
  }

  async disperseFunds(
    to: Array<FundsTo>
  ): Promise<Array<string | UnsignedErgoTxProxy | UnsignedPsbtData>> {
    throw new Error('Not Implemented');
  }

  async generateUnsignedTransferTx(to: FundsTo): Promise<any> {
    throw new Error('Not Implemented');
  }
}
