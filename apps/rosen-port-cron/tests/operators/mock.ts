import { Networks } from '@rosen-port/chains';
import { Container, ContainerStatus, Tx } from '@rosen-port/db';
import { RosenUserInterface } from '@rosen/sdk';
import { LoenRosenSDKConfig } from '../../src/constants/explorerConstants';
import { ErgoNetworkType } from '@rosen-bridge/minimum-fee';
import tokens from '../assets/test-rosen-loen-tokens.json';
export const ERGO_EXPLORER_URL = 'https://api.ergoplatform.com/';

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

export const testRosenUI: RosenUserInterface = new RosenUserInterface(
  // @ts-ignore
  tokens,
  testRSNRatioNFT,
  ErgoNetworkType.explorer,
  ERGO_EXPLORER_URL,
  LoenRosenSDKConfig
);
