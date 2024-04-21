import { EIP12UnsignedTransaction } from '@fleet-sdk/common';

export interface Txs {
  sendTo: (amount: bigint, walletAddress: string) => EIP12UnsignedTransaction;
}
