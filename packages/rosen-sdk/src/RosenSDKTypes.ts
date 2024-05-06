import { Networks } from './constants';

export interface TransferConfig {
  sourceNetwork: keyof typeof Networks;
  tokenId: string;
  explorerUrl: string;
  nextHeightInterval: number;
}

export interface TransferFee {
  tokenId: string;
  status: 'error' | 'success';
  message?: string;
  feeRatioDivisor?: bigint;
  data?: string;
}

export interface TransferResult {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface TxHistory {
  transactions: TransferResult[];
}
