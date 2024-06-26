import { Networks } from '@rosen-port/chains';
import { ChainNotSupportedException } from '@rosen/sdk';

export const getNetworks = (network: string): keyof typeof Networks => {
  switch (network) {
    case Networks.ergo:
      return Networks.ergo;
    case Networks.cardano:
      return Networks.cardano;
    case Networks.bitcoin:
      return Networks.bitcoin;
    default:
      throw new ChainNotSupportedException();
  }
};
