import { RosenChainToken } from '@rosen-bridge/tokens';
import { UnsignedPsbtData } from '@rosen-port/chains';
import { UnsignedErgoTxProxy } from '@rosen-ui/wallet-api';

export interface FundsTo {
  token: RosenChainToken;
  decimalAmount: number;
  toAddress: string;
}

export interface IChainTx {
  connect: () => Promise<boolean>;
  generateUnsignedTransferTx: (
    to: FundsTo
  ) => Promise<string | UnsignedErgoTxProxy | UnsignedPsbtData>;

  disperseFunds: (
    to: Array<FundsTo>
  ) => Promise<Array<string | UnsignedErgoTxProxy | UnsignedPsbtData>>;
}
