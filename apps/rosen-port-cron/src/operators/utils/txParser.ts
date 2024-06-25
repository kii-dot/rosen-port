import {
  EIP12UnsignedTransaction,
  EIP12UnsignedDataInput,
  EIP12UnsignedInput,
  BoxCandidate,
} from '@fleet-sdk/common';
import { ErgoBoxProxy, UnsignedErgoTxProxy } from '@rosen-ui/wallet-api';
import { CardanoUtxo } from '@rosen/sdk';
import { UnsignedTransaction } from 'ergo-lib-wasm-nodejs';

export const parseTx = (
  inputs: Array<ErgoBoxProxy | CardanoUtxo>,
  unsignedLockTx: string | UnsignedTransaction
): string | UnsignedErgoTxProxy => {
  switch (typeof unsignedLockTx) {
    case 'string':
      return unsignedLockTx;
    default:
      return unsignedTransactionToProxy(
        unsignedLockTx,
        inputs as Array<ErgoBoxProxy>
      );
  }
};
/**
 * converts wasm UnsignedTransaction to UnsignedErgoTxProxy format
 * @param unsignedTx
 * @param inputs
 * @returns
 */
export const unsignedTransactionToProxy = (
  unsignedTx: UnsignedTransaction,
  inputs: ErgoBoxProxy[]
): UnsignedErgoTxProxy => {
  const unsignedErgoTxProxy = unsignedTx.to_js_eip12();
  unsignedErgoTxProxy.inputs = inputs.map((box) => {
    return {
      ...box,
      extension: {},
    };
  });
  return unsignedErgoTxProxy;
};
