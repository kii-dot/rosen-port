import { Networks } from './chains';

const CardanoExplorerUrl = 'https://cardanoscan.io/transaction/';
const ErgoExplorerUrl = 'https://explorer.ergoplatform.com/en/transactions/';
const BitcoinExplorerUrl = 'https://blockstream.info/tx/';

export const GetTxUrl = (network: Networks, tx: string) => {
  switch (network) {
    case Networks.Bitcoin:
      return BitcoinExplorerUrl + tx;
    case Networks.Cardano:
      return CardanoExplorerUrl + tx;
    case Networks.Ergo:
      return ErgoExplorerUrl + tx;
    default:
      throw new Error('Network not supported');
  }
};
