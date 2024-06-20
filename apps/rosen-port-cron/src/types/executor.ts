import { Wallet, RosenPortDBClient } from '@rosen-port/db';

abstract class Executor {
  abstract onBeforeExecute(): Promise<void>;
  abstract onAfterExecute(): Promise<void>;
  abstract onExecute(): Promise<void>;
  async execute(): Promise<void> {
    await this.onBeforeExecute();
    await this.onExecute();
    await this.onAfterExecute();
  }
}

interface IWalletClient {
  getWallet(chain: string): Promise<Wallet>;
}

class WalletClient implements IWalletClient {
  dbClient: RosenPortDBClient;
  constructor(dbClient: RosenPortDBClient) {
    this.dbClient = dbClient;
  }

  async getWallet(chain: string): Promise<Wallet> {
    return await this.dbClient.wallet.getWallet(chain);
  }
}

abstract class PortExecutor extends Executor {
  walletClient: IWalletClient;

  async getPortWallet(chain: string): Promise<Wallet> {
    const rosenPortWalletAddress = await this.walletClient.getWallet(chain);

    return rosenPortWalletAddress;
  }
}

export { Executor, PortExecutor, IWalletClient, WalletClient };
