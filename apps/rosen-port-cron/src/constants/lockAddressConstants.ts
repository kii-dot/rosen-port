import { Networks } from '@rosen-port/chains';
import { ChainNotSupportedException } from '@rosen/sdk';

export const getLockAddress = (network: keyof typeof Networks) => {
  switch (network) {
    case Networks.ergo:
      return '';
    case Networks.cardano:
      return '';
    case Networks.bitcoin:
      return '';
    default:
      throw new ChainNotSupportedException();
  }
};
