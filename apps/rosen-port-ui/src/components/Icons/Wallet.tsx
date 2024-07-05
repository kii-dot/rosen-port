import nautilus from '#/assets/wallets/nautilus.svg';
import nami from '#/assets/wallets/nami.svg';
import eternl from '#/assets/wallets/eternl.svg';
import flint from '#/assets/wallets/flint.svg';
import lace from '#/assets/wallets/lace.svg';
import vespr from '#/assets/wallets/vespr.svg';
import xdefi from '#/assets/wallets/xdefi.svg';
import { Networks } from '#/constants/chains';
import classNames from 'classnames';
import { CardanoWalletType } from '#/tools/wallet/cardano/CardanoWallet';
import { ErgoWalletType } from '#/tools/wallet/ergo/ErgoWallet';

interface IconProps {
  className?: string;
}

// Ergo
export function NautilusIcon({ className }: IconProps) {
  return <img src={nautilus} alt="" className={className} />;
}

// Cardano
export function NamiIcon({ className }: IconProps) {
  return <img src={nami} alt="" className={className} />;
}

export function EternlIcon({ className }: IconProps) {
  return <img src={eternl} alt="" className={className} />;
}

export function FlintIcon({ className }: IconProps) {
  return <img src={flint} alt="" className={className} />;
}

export function LaceIcon({ className }: IconProps) {
  return <img src={lace} alt="" className={className} />;
}

export function VesprIcon({ className }: IconProps) {
  return <img src={vespr} alt="" className={className} />;
}

// BTC
export function XDefiIcon({ className }: IconProps) {
  return <img src={xdefi} alt="" className={classNames(className, 'text-white bg-white')} />;
}

export interface IWallet {
  name: string;
  network: Networks;
  walletType: ErgoWalletType | CardanoWalletType;
  icon: (className: IconProps) => JSX.Element;
}

export const NautilusWallet: IWallet = {
  name: 'Nautilus',
  network: Networks.Ergo,
  walletType: ErgoWalletType.Nautilus,
  icon: NautilusIcon,
};

export const NamiWallet: IWallet = {
  name: 'Nami',
  network: Networks.Cardano,
  walletType: CardanoWalletType.Nami,
  icon: NamiIcon,
};

export const EternlWallet: IWallet = {
  name: 'Eternl',
  network: Networks.Cardano,
  walletType: CardanoWalletType.Eternl,
  icon: EternlIcon,
};

export const FlintWallet: IWallet = {
  name: 'Flint',
  network: Networks.Cardano,
  walletType: CardanoWalletType.Flint,
  icon: FlintIcon,
};

export const LaceWallet: IWallet = {
  name: 'Lace',
  network: Networks.Cardano,
  walletType: CardanoWalletType.Lace,
  icon: LaceIcon,
};

export const VesprWallet: IWallet = {
  name: 'Vespr',
  network: Networks.Cardano,
  walletType: CardanoWalletType.Vespr,
  icon: VesprIcon,
};

export const XDefiWallet: IWallet = {
  name: 'XDefi',
  network: Networks.Bitcoin,
  walletType: CardanoWalletType.Nami,
  icon: XDefiIcon,
};
