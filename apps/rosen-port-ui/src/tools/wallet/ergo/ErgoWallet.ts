import {
  Address,
  EipWalletApi,
  ErgoBoxProxy,
  ErgoTxProxy,
  NErg,
  Paging,
  TokenId,
  TxId,
  UnsignedErgoTxProxy,
} from '@rosen-ui/wallet-api';

export enum ErgoWalletType {
  Nautilus = 'nautilus',
  SafeW = 'safew',
}

export interface EipWalletBase {
  getUtxos: (amount: NErg, tokenId?: TokenId, paginate?: Paging) => Promise<ErgoBoxProxy[] | undefined>;
  getChangeAddress: () => Promise<Address>;
  getBalance: (tokenId: string) => Promise<string>;
  signTx: (tx: UnsignedErgoTxProxy) => Promise<ErgoTxProxy>;
  submitTx: (tx: ErgoTxProxy) => Promise<TxId>;
  connectWallet: () => Promise<boolean>;
  signAndSubmitTx: (tx: UnsignedErgoTxProxy) => Promise<TxId>;
}

export class ErgoWallet implements EipWalletBase {
  private walletType: ErgoWalletType;
  isSupported: boolean;
  constructor(walletType: ErgoWalletType) {
    this.walletType = walletType;
    this.isSupported =
      globalThis.ergoConnector !== undefined && !(globalThis.ergoConnector[this.walletType] === undefined);
  }

  ensureAvailable() {
    if (!this.isSupported) {
      throw new Error('EXTENSION_NOT_FOUND');
    }
  }

  async getContext(): Promise<EipWalletApi> {
    return await globalThis.ergoConnector[this.walletType].getContext();
  }

  async getUtxos(amount: NErg, tokenId?: TokenId, paginate?: Paging): Promise<ErgoBoxProxy[] | undefined> {
    const context = await this.getContext();
    return await context.get_utxos(amount, tokenId, paginate);
  }

  async getChangeAddress(): Promise<Address> {
    const context = await this.getContext();
    return await context.get_change_address();
  }

  async getBalance(tokenId: string): Promise<string> {
    this.ensureAvailable();
    const context = await this.getContext();
    return context.get_balance(tokenId);
  }

  async signTx(tx: UnsignedErgoTxProxy): Promise<ErgoTxProxy> {
    const context = await this.getContext();
    return context.sign_tx(tx);
  }

  async submitTx(tx: ErgoTxProxy): Promise<TxId> {
    const context = await this.getContext();
    return context.submit_tx(tx);
  }

  async connectWallet(): Promise<boolean> {
    this.ensureAvailable();

    if (!globalThis.ergoConnector[this.walletType].getContext) {
      throw new Error('Wallet API has changed. Be sure to update your wallet to continue using it');
    }

    return await globalThis.ergoConnector[this.walletType].connect({ createErgoObject: true });
  }

  async signAndSubmitTx(tx: UnsignedErgoTxProxy): Promise<TxId> {
    const signedTx = await this.signTx(tx);
    return await this.submitTx(signedTx);
  }
}
