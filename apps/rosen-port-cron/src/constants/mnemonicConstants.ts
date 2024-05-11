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
