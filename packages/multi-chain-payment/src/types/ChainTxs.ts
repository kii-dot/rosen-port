import { EIP12UnsignedTransaction } from '@fleet-sdk/common';
import { RosenChainToken } from '@rosen-bridge/tokens';
import { UnsignedPsbtData } from '@rosen-port/chains';

export interface FundsTo {
  token: RosenChainToken;
  decimalAmount: number;
  toAddress: string;
}

export interface IChainTx {
  connect: () => Promise<boolean>;

  /**
   * Generate UnsignedTx for a wallet to
   * @param to
   * @returns
   */
  generateTransferUnsignedTx: (
    to: FundsTo
  ) => Promise<string | EIP12UnsignedTransaction | UnsignedPsbtData>;

  /**
   * Disperse funds to each of the FundsTo address
   * @param to
   * @returns
   */
  generateDisperseUnsignedTxs: (
    to: Array<FundsTo>
  ) => Promise<string | EIP12UnsignedTransaction | UnsignedPsbtData>;
}
