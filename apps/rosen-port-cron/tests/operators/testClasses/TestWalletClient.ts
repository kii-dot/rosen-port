import { Wallet } from '@rosen-port/db';
import { IWalletClient } from '../../../src/operators/utils/WalletClient';
import {
  IMCPWallet,
  IMultiChainPayment,
} from '@rosen-port/multi-chain-payment';
import { Networks } from '@rosen-port/chains';

export class TestWalletClient implements IWalletClient {
  private walletStore: Map<string, Wallet>;
  network: keyof typeof Networks;

  constructor() {
    this.walletStore = new Map(); // Initializes a map to store Wallet objects keyed by chain.
  }

  setNetwork(network: keyof typeof Networks): void {
    this.network = network;
  }

  getMCPWallet(): IMCPWallet {
    throw new Error('Method not implemented.');
  }

  getMultiChainPayment(): IMultiChainPayment {
    throw new Error('Method not implemented.');
  }

  async getWallet(chain: string): Promise<Wallet> {
    // Retrieve a wallet based on the chain. If no wallet is found, return null (or throw an error).
    const wallet = this.walletStore.get(chain);
    if (!wallet) {
      throw new Error(`No wallet found for chain: ${chain}`);
    }
    return wallet;
  }

  // Method to add wallets to the store for testing purposes.
  addWallet(wallet: Wallet) {
    this.walletStore.set(wallet.chain, wallet);
  }
}

export class TestWalletClientFactory {
  static generate(): TestWalletClient {
    const testClient = new TestWalletClient();

    testClient.addWallet(
      new Wallet({
        chain: 'Ethereum',
        walletAddress: '0x123456789abcdef',
      })
    );

    testClient.addWallet(
      new Wallet({
        chain: 'Bitcoin',
        walletAddress: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
      })
    );

    return testClient;
  }
}
