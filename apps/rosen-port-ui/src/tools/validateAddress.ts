import { Address } from 'ergo-lib-wasm-nodejs';
import { Networks } from '#/constants/chains';

import * as wasm from '@emurgo/cardano-serialization-lib-nodejs';

/**
 * server action to verify the wallet addresses
 * @param walletAddress - wallet address to verify
 * @returns the validation results for the passed address
 */
export const validateAddress = (chain: Networks, walletAddress: string) => {
  try {
    if (chain === Networks.Ergo) {
      Address.from_base58(walletAddress);
    } else if (chain === Networks.Cardano) {
      wasm.Address.from_bech32(walletAddress);
    }
    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Invalid Address' };
  }
};
