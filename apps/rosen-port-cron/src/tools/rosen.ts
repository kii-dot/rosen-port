import { RosenUserInterface } from '@rosen/sdk';
import tokens from '../assets/rosenTokens.json';
import launchConfig from '../assets/rosenLaunchConfig.json';

// Tokens: https://github.com/rosen-bridge/contract/releases
export const rosenUI = new RosenUserInterface(
  tokens,
  launchConfig.tokens.RSNRatioNFT
);
