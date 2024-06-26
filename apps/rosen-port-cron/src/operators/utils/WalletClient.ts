import { Networks } from '@rosen-port/chains';
import { RosenPortDBClient, Token, Wallet } from '@rosen-port/db';
import {
  IMCPWallet,
  IMultiChainPayment,
  MCPWallet,
  MultiChainPayment,
} from '@rosen-port/multi-chain-payment';
import { NetworkNotSetException } from '../../errors/networkErrors';

export interface IWalletClient {
  getWalletInfoFromStore(chain: string): Promise<Wallet>;
  setNetwork(network: keyof typeof Networks): void;
  getMCPWallet(): IMCPWallet;
  getMultiChainPayment(): IMultiChainPayment;
}

export class WalletClient implements IWalletClient {
  dbClient: RosenPortDBClient;
  network: keyof typeof Networks;
  constructor(dbClient: RosenPortDBClient) {
    this.dbClient = dbClient;
  }

  private ensureNetwork(): void {
    if (!this.network) {
      throw new NetworkNotSetException();
    }
  }

  async getWalletInfoFromStore(chain: string): Promise<Wallet> {
    return await this.dbClient.wallet.getWallet(chain);
  }

  setNetwork(network: keyof typeof Networks): void {
    this.network = network;
  }

  getMCPWallet(): IMCPWallet {
    this.ensureNetwork();

    return new MCPWallet(this.network);
  }

  getMultiChainPayment(): IMultiChainPayment {
    this.ensureNetwork();

    return new MultiChainPayment(this.network);
  }
}
