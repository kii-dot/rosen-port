import { CardanoWallet, CardanoWalletType, CipWalletBase } from './cardano/CardanoWallet';
import { EipWalletBase, ErgoWallet, ErgoWalletType } from './ergo/ErgoWallet';

export const isWalletAvailable = (walletType: ErgoWalletType | CardanoWalletType): boolean => {
  // BUG:
  // cardano and ergoConnector does not exist in global at startup.
  // Vike does not understand that. And therefore we have to instantiate
  // it first.
  // This is a HACK and should be fixed
  const cardano = globalThis.cardano;
  const ergoConnector = globalThis.ergoConnector;

  switch (walletType) {
    case ErgoWalletType.Nautilus:
    case ErgoWalletType.SafeW:
      return ergoConnector !== undefined && ergoConnector[walletType] !== undefined;
    case CardanoWalletType.Eternl:
    case CardanoWalletType.Vespr:
    case CardanoWalletType.Flint:
    case CardanoWalletType.Lace:
    case CardanoWalletType.Nami:
      return cardano !== undefined && cardano[walletType] !== undefined;
    default:
      return false;
  }
};

export const getWallet = (walletType: ErgoWalletType | CardanoWalletType): EipWalletBase | CipWalletBase => {
  switch (walletType) {
    case ErgoWalletType.Nautilus:
    case ErgoWalletType.SafeW:
      return new ErgoWallet(walletType);
    case CardanoWalletType.Eternl:
    case CardanoWalletType.Vespr:
    case CardanoWalletType.Flint:
    case CardanoWalletType.Lace:
    case CardanoWalletType.Nami:
      return new CardanoWallet(walletType);
    default:
      throw new Error('Network not supported');
  }
};
