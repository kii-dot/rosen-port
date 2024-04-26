import { RosenChainToken } from '@rosen-bridge/tokens';
import { UnsignedPsbtData } from './BitcoinTxTypes';
import { UnsignedErgoTxProxy } from '@rosen-ui/wallet-api';

export interface IChainTx {
  connect: () => Promise<boolean>;
  generateUnsignedTransferTx: (
    token: RosenChainToken,
    decimalAmount: number,
    toAddress: string
  ) => Promise<string | UnsignedErgoTxProxy | UnsignedPsbtData>;
}
