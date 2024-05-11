import { Networks } from '.';

const ETHEREUM_CHAIN = 'ethereum';
export const BitcoinChainConstants = {
  SEGWIT_INPUT_WEIGHT_UNIT: 272,
  SEGWIT_OUTPUT_WEIGHT_UNIT: 124,
  CONFIRMATION_TARGET: 6,
  SUPPORTED_CHAINS: [
    Networks.ergo,
    Networks.cardano,
    Networks.bitcoin,
    ETHEREUM_CHAIN,
  ],
};
