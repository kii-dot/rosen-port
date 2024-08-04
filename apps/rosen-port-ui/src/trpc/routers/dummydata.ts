import { SigUSDToken } from '#/constants/tokens';
import { Container, ContainerStatus, Token, Tx, TxStatus, TxWithContainerInfo } from '#/db';
import { Chain } from '#/db/dbConstants';

const sigUsdToken = new Token({
  id: '3222e909-9058-4722-82f1-cd7e37550356',
  name: 'SigUSD',
  tokenId: '03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04',
  nativeChain: Chain.ergo,
});
export const dummyTxData = [
  new TxWithContainerInfo({
    tx: new Tx({
      id: '35b18163-a725-4848-a3b9-26d2e15621b0',
      createdAt: '2024-04-17T16:54:13.725454+00:00',
      initiatedTxId: '8f88181a1426afc7467fa5e1d8fea87bf53a8ad32c8f6c2400ccb4a6c1217a03',
      amount: 1000000,
      sourceAddress: '9hrT4Kt8R4NAJoYiHZ6Cnpo4BcGLA32S58UjckJSxAcRF1xUops',
      destAddress:
        'addr1q8zjxvnj9cqh2ernglzgem8c0kvvp7nlmtqvzztyevpx2h6fa3yr34tv9qgjvkyz3q2f9hqrycace02rfzqv8dwvq7zse2hp6c',
      txStatus: TxStatus.drafted,
      distributedTxId: '',
      containerId: '',
    }),
    container: new Container({
      id: 'd4925284-4687-4ceb-9dd2-a82ec3f3dfb1',
      createdAt: '2024-04-17T06:00:07.864326+00:00',
      bridgedTime: '',
      bridgedTxId: '',
      sourceChain: 'ergo',
      destChain: 'cardano',
      tokenType: sigUsdToken,
      status: ContainerStatus.initiated,
      totalAmount: 0,
    }),
  }),
  new TxWithContainerInfo({
    tx: new Tx({
      id: 'ff1c4db7-4b0a-4c62-9d6c-8830d9d4ed3d',
      createdAt: '2024-04-17T06:51:56.888051+00:00',
      initiatedTxId: '5863edb21b09fea1ae469b657c02c06c9308039d469459ba97990d2bed67c613',
      amount: 100000,
      sourceAddress:
        'addr1q8zjxvnj9cqh2ernglzgem8c0kvvp7nlmtqvzztyevpx2h6fa3yr34tv9qgjvkyz3q2f9hqrycace02rfzqv8dwvq7zse2hp6c',
      destAddress: '9hrT4Kt8R4NAJoYiHZ6Cnpo4BcGLA32S58UjckJSxAcRF1xUops',
      txStatus: TxStatus.sent,
      distributedTxId: 'retry',
      containerId: '6e86d7ca-f4ca-496b-b655-10052dcc3be6',
    }),
    container: new Container({
      id: '6e86d7ca-f4ca-496b-b655-10052dcc3be6',
      createdAt: '2024-04-17T06:50:18.7945+00:00',
      bridgedTime: '',
      bridgedTxId: '',
      sourceChain: 'cardano',
      destChain: 'ergo',
      tokenType: sigUsdToken,
      status: ContainerStatus.bridged,
      totalAmount: 0,
    }),
  }),
  new TxWithContainerInfo({
    tx: new Tx({
      id: 'bc7921df-27f2-4860-b3f7-533be98611eb',
      createdAt: '2024-05-09T05:33:19.420915+00:00',
      initiatedTxId: '94df75d1b0e1d73e611acc677317fee24dadac2aef10903ade4046ef5f93f062',
      amount: 1000000000,
      sourceAddress: '9f83nJY4x9QkHmeek6PJMcTrf2xcaHAT3j5HD5sANXibXjMUixn',
      destAddress: '9hrT4Kt8R4NAJoYiHZ6Cnpo4BcGLA32S58UjckJSxAcRF1xUops',
      txStatus: TxStatus.sent,
      distributedTxId: 'retry',
      containerId: '6e86d7ca-f4ca-496b-b655-10052dcc3be6',
    }),
    container: new Container({
      id: '6e86d7ca-f4ca-496b-b655-10052dcc3be6',
      createdAt: '2024-04-17T06:50:18.7945+00:00',
      bridgedTime: '',
      bridgedTxId: '',
      sourceChain: 'cardano',
      destChain: 'ergo',
      tokenType: sigUsdToken,
      status: ContainerStatus.bridged,
      totalAmount: 0,
    }),
  }),
];
