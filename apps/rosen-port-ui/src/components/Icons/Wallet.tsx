import nautilus from '#/assets/wallets/nautilus.svg';
import nami from '#/assets/wallets/nami.svg';
import eternl from '#/assets/wallets/eternl.svg';
import flint from '#/assets/wallets/flint.svg';
import lace from '#/assets/wallets/lace.svg';
import vespr from '#/assets/wallets/vespr.svg';
import xdefi from '#/assets/wallets/xdefi.svg';
import { Networks } from '#/constants/chains';
import classNames from 'classnames';

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
  icon: (className: IconProps) => JSX.Element;
}

export const NautilusWallet: IWallet = {
  name: 'Nautilus',
  network: Networks.Ergo,
  icon: NautilusIcon,
};

export const NamiWallet: IWallet = {
  name: 'Nami',
  network: Networks.Cardano,
  icon: NamiIcon,
};

export const EternlWallet: IWallet = {
  name: 'Eternl',
  network: Networks.Cardano,
  icon: EternlIcon,
};

export const FlintWallet: IWallet = {
  name: 'Flint',
  network: Networks.Cardano,
  icon: FlintIcon,
};

export const LaceWallet: IWallet = {
  name: 'Lace',
  network: Networks.Cardano,
  icon: LaceIcon,
};

export const VesprWallet: IWallet = {
  name: 'Vespr',
  network: Networks.Cardano,
  icon: VesprIcon,
};

export const XDefiWallet: IWallet = {
  name: 'XDefi',
  network: Networks.Bitcoin,
  icon: XDefiIcon,
};
