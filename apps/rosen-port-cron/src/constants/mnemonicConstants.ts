import { Networks } from '@rosen-port/chains';
import { ChainNotSupportedException } from '@rosen/sdk';

const ErgoWalletMnemonic =
  process.env.ERGO_WALLET_MNEMONIC !== undefined
    ? process.env.ERGO_WALLET_MNEMONIC
    : '';
const CardanoWalletMnemonic =
  process.env.CARDANO_WALLET_MNEMONIC !== undefined
    ? process.env.CARDANO_WALLET_MNEMONIC
    : '';
const BitcoinWalletMnemonic =
  process.env.BITCOIN_WALLET_MNEMONIC !== undefined
    ? process.env.BITCOIN_WALLET_MNEMONIC
    : '';

export const MNEMONIC = {
  ergo: ErgoWalletMnemonic,
  bitcoin: BitcoinWalletMnemonic,
  cardano: CardanoWalletMnemonic,
};

export const getMnemonic = (network: keyof typeof Networks): string => {
  switch (network) {
    case Networks.ergo:
      return MNEMONIC.ergo;
    case Networks.cardano:
      return MNEMONIC.cardano;
    case Networks.bitcoin:
      return MNEMONIC.bitcoin;
    default:
      throw new ChainNotSupportedException('[GetMnemonic] Chain not supported');
  }
};
