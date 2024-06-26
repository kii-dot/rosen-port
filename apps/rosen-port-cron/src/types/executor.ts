import { Wallet } from '@rosen-port/db';
import { IWalletClient } from '../operators/utils/WalletClient';

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
  walletClient: IWalletClient;

  async getPortWalletInfo(chain: string): Promise<Wallet> {
    const rosenPortWalletAddress =
      await this.walletClient.getWalletInfoFromStore(chain);

    return rosenPortWalletAddress;
  }
}

export { Executor, PortExecutor };
