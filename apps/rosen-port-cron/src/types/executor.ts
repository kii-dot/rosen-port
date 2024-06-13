import { Wallet } from '@rosen-port/db';
import { DBClient } from '@rosen-port/db/dist/src/dbClient';

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

abstract class PortExecutor extends Executor {
  db: DBClient;

  async getPortWallet(chain: string): Promise<Wallet> {
    const rosenPortWalletAddress = await this.db.wallet.getWallet(chain);

    return rosenPortWalletAddress;
  }
}

export { Executor, PortExecutor };
