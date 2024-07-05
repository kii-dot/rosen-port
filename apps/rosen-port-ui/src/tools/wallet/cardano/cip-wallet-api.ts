import {
  EncodedAddress,
  EncodedAmount,
  EncodedBalance,
  EncodedTxOut,
  HexString,
  Paging,
  RawTx,
  RawUnsignedTx,
  TxId,
} from '@rosen-ui/wallet-api';

/**
 * carano wallets interface
 */
export interface CipWalletApi {
  getUtxos(amount?: EncodedAmount, paginate?: Paging): Promise<EncodedTxOut[] | undefined>;
  getCollateral(params?: { amount?: EncodedAmount }): Promise<EncodedTxOut[] | undefined>;
  experimental: {
    getCollateral(params: { amount?: EncodedAmount }): Promise<EncodedTxOut[] | undefined>;
  };
  getChangeAddress(): Promise<EncodedAddress>;
  getBalance(): Promise<EncodedBalance>;
  getUsedAddresses(paginate?: Paging): Promise<EncodedAddress[]>;
  getUnusedAddresses(paginate?: Paging): Promise<EncodedAddress[]>;
  signTx(tx: RawUnsignedTx, partialSign: boolean): Promise<RawTx>;
  getNetworkId(): Promise<number>;
  submitTx(tx: RawTx): Promise<TxId>;
}
