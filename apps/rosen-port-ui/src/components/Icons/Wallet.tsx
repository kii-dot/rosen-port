import nautilus from '#/assets/wallets/nautilus.svg';
import nami from '#/assets/wallets/nami.svg';
import eternl from '#/assets/wallets/eternl.svg';
import flint from '#/assets/wallets/flint.svg';
import lace from '#/assets/wallets/lace.svg';
import vespr from '#/assets/wallets/vespr.svg';
import xdefi from '#/assets/wallets/xdefi.svg';

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

export function XDefiIcon({ className }: IconProps) {
  return <img src={xdefi} alt="" className={className} />;
}
