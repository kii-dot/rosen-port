import { RosenUserInterface } from '@rosen/sdk';
import { testRSNRatioNFT } from '../operators/mock';
import { ErgoNetworkType } from '@rosen-bridge/minimum-fee';
import tokens from '../assets/test-rosen-loen-tokens.json';
import {
  ERGO_EXPLORER_URL,
  LoenRosenSDKConfig,
} from '../../src/constants/explorerConstants';

export const testRosenUI: RosenUserInterface = new RosenUserInterface(
  // @ts-ignore
  tokens,
  testRSNRatioNFT,
  ErgoNetworkType.explorer,
  ERGO_EXPLORER_URL,
  LoenRosenSDKConfig
);
