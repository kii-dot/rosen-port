import {
  AssetEntry,
  CipWalletApi,
  EncodedAddress,
  EncodedAmount,
  EncodedBalance,
  EncodedTxOut,
  Paging,
  RawTx,
  RawUnsignedTx,
  TxId,
} from '@rosen-ui/wallet-api';
import { decodeWasmAddress, decodeWasmValue } from './cardanoDecoder';

export enum CardanoWalletType {
  Nami = 'nami',
  Flint = 'flint',
  Eternl = 'eternl',
  Lace = 'lace',
  Vespr = 'vespr',
}

export interface CipWalletBase {
  getUtxos: (amount?: EncodedAmount, paginate?: Paging) => Promise<EncodedTxOut[] | undefined>;
  getChangeAddress: () => Promise<EncodedAddress>;
  getBalance: (policyId: string) => Promise<AssetEntry>;
  signTx: (tx: RawUnsignedTx, partialSign: boolean) => Promise<RawTx>;
  submitTx: (tx: RawTx) => Promise<TxId>;
  connectWallet: () => Promise<boolean>;
  signAndSubmitTx: (tx: RawUnsignedTx, partialSign: boolean) => Promise<TxId>;
}

export class CardanoWallet implements CipWalletBase {
  private walletType: CardanoWalletType;
  isSupported: boolean;
  wallet: CipWalletApi | undefined;
  constructor(walletType: CardanoWalletType) {
    this.walletType = walletType;
    this.isSupported = globalThis.cardano !== undefined || !(globalThis.cardano[this.walletType] === undefined);
  }

  ensureAvailable() {
    if (!this.isSupported) {
      throw new Error('EXTENSION_NOT_FOUND');
    }
  }

  async connectWallet(): Promise<boolean> {
    if (!this.isSupported) {
      throw new Error('EXTENSION_NOT_FOUND');
    }

    this.wallet = await globalThis.cardano[this.walletType].enable();

    if (!this.wallet) {
      throw new Error('Wallet Failed to Connect');
    }

    return true;
  }

  async getUtxos(amount?: string | undefined, paginate?: Paging | undefined): Promise<string[] | undefined> {
    this.ensureAvailable();
    return await this.wallet?.getUtxos(amount, paginate);
  }

  async getChangeAddress(): Promise<string> {
    this.ensureAvailable();
    if (!this.wallet) {
      throw new Error('Wallet Failed to Connect');
    }

    return await decodeWasmAddress(await this.wallet.getChangeAddress());
  }

  async getBalance(policyId: string): Promise<AssetEntry> {
    this.ensureAvailable();
    if (!this.wallet) {
      throw new Error('Wallet Failed to Connect');
    }

    const balance = await this.wallet.getBalance();
    const tokenBalance = (await decodeWasmValue(balance)).filter((token) => token.policyId === policyId)[0];

    return tokenBalance;
  }

  async signTx(tx: string, partialSign: boolean): Promise<string> {
    this.ensureAvailable();
    if (!this.wallet) {
      throw new Error('Wallet Failed to Connect');
    }

    return await this.wallet.signTx(tx, partialSign);
  }

  async submitTx(tx: string): Promise<string> {
    this.ensureAvailable();
    if (!this.wallet) {
      throw new Error('Wallet Failed to Connect');
    }

    return await this.wallet.submitTx(tx);
  }

  async signAndSubmitTx(tx: string, partialSign: boolean): Promise<string> {
    const signedTx = await this.signTx(tx, partialSign);
    return await this.submitTx(signedTx);
  }
}
