import { Networks } from '@rosen-port/chains';
import {
  Container,
  ContainerStatus,
  Refund,
  RefundStatus,
  Tx,
  TxStatus,
} from '@rosen-port/db';

export const testRSNRatioNFT =
  '05690d3e7a8daae13495b32af8ab58aaec8a5435f5974f6adf17095d28cac1f5';
export const testContainers = {
  unbridged: new Container({
    id: 'testId',
    createdAt: '',
    bridgedTime: '',
    bridgedTxId: 'bridgedTxId',
    sourceChain: Networks.ergo,
    destChain: Networks.cardano,
    tokenType: {
      id: 'testTokenId',
      name: 'ergo',
      tokenId: 'native',
      nativeChain: 0,
    },
    status: ContainerStatus.filled,
    totalAmount: 100000,
  }),
  bridged: new Container({
    id: 'bridgedContainer',
    createdAt: '',
    bridgedTime: '',
    bridgedTxId: 'bridgedTxId',
    sourceChain: Networks.ergo,
    destChain: Networks.cardano,
    tokenType: {
      id: 'testTokenId',
      name: 'ergo',
      tokenId: 'native',
      nativeChain: 0,
    },
    status: ContainerStatus.bridged,
    totalAmount: 100000,
  }),
};

export const confirmedTxs = [
  new Tx({
    id: 'confirmedTx2',
    createdAt: '2024-06-20T12:00:00Z',
    initiatedTxId: 'init1',
    amount: 1000,
    sourceAddress: 'addr1',
    destAddress: 'addr2',
    txStatus: TxStatus.confirmed,
    distributedTxId: '',
    containerId: 'confirmedContainer',
  }),

  new Tx({
    id: 'confirmedTx2',
    createdAt: '2024-06-20T12:00:00Z',
    initiatedTxId: 'init2',
    amount: 1000,
    sourceAddress: 'addr1',
    destAddress: 'addr2',
    txStatus: TxStatus.confirmed,
    distributedTxId: '',
    containerId: 'confirmedContainer',
  }),
];

export const bridgedTxs: Tx[] = [
  new Tx({
    id: 'bridgedTx',
    createdAt: '2024-06-20T12:10:00Z',
    initiatedTxId: 'init3',
    amount: 200,
    sourceAddress: 'addr3',
    destAddress: 'addr4',
    txStatus: TxStatus.bridged,
    distributedTxId: 'dist2',
    containerId: 'bridgedContainer',
  }),
];

export const unconfirmedTx: Tx[] = [
  new Tx({
    id: 'tx123',
    createdAt: '2024-06-20T12:00:00Z',
    initiatedTxId: 'init4',
    amount: 100,
    sourceAddress: 'addr1',
    destAddress: 'addr2',
    txStatus: TxStatus.confirmed,
    distributedTxId: 'dist123',
    containerId: 'container123',
  }),
];

export const refunds = [
  new Refund({
    id: 'refund1',
    createdAt: '2024-06-20T12:00:00Z',
    txToRefund: confirmedTxs[0],
    status: RefundStatus.refund_initiated,
    refundTxId: '',
    serviceFeeTxId: 'serviceFee2',
    container: testContainers.unbridged,
  }),
  new Refund({
    id: 'refund2',
    createdAt: '2024-06-20T12:00:00Z',
    txToRefund: confirmedTxs[1],
    status: RefundStatus.refund_valid,
    refundTxId: '',
    serviceFeeTxId: 'serviceFee1',
    container: testContainers.unbridged,
  }),
];
