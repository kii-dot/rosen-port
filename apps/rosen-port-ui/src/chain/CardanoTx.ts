import { EIP12UnsignedTransaction } from '@fleet-sdk/common';
import { Txs } from './Txs';

export class CardanoTxs implements Txs {
  constructor() {}
  sendTo(amount: bigint, walletAddress: string): EIP12UnsignedTransaction {}
}
