export const DEFAULT_CARDANO_EXPLORER_URL = 'https://api.koios.rest/api/v1';
export const DEFAULT_ERGO_EXPLORER_URL = 'https://api.ergoplatform.com/';
export const DEFAULT_BITCOIN_EXPLORER_URL = 'https://blockstream.info/';

export const ERGO_EXPLORER_URL =
  process.env.ERGO_EXPLORER_URL !== undefined
    ? process.env.ERGO_EXPLORER_URL
    : DEFAULT_ERGO_EXPLORER_URL;
export const CARDANO_EXPLORER_URL =
  process.env.CARDANO_EXPLORER_URL !== undefined
    ? process.env.CARDANO_EXPLORER_URL
    : DEFAULT_CARDANO_EXPLORER_URL;
export const BITCOIN_EXPLORER_URL =
  process.env.BITCOIN_EXPLORER_URL !== undefined
    ? process.env.BITCOIN_EXPLORER_URL
    : DEFAULT_BITCOIN_EXPLORER_URL;

export const LoenRosenSDKConfig = {
  NetworkConfig: {
    CardanoExplorerAPI: CARDANO_EXPLORER_URL,
    ErgoExplorerAPI: ERGO_EXPLORER_URL,
    BitcoinExplorerAPI: BITCOIN_EXPLORER_URL,
  },
};
