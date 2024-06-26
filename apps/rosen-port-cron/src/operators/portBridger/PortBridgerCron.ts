import { CronCategory } from '../../constants/cronConstants';
import { Container, ContainerStatus, RosenPortDBClient } from '@rosen-port/db';
import { PortBridger } from './PortBridger';
import { RosenPortCronExecutor } from '../../cron/RosenPortCronExecutor';
import { RosenUserInterface } from '@rosen/sdk';
import { ContainerTxStoreClient } from '../fundDistributor/storeClient';
import { WalletClient } from '../utils/WalletClient';

/**
 * The goal of this cron job is to:
 * Check to see if Rosen-port-wallet has the right funds.
 * Bridge the funds from Rosen-port-wallet to the dest chain wallet
 * Confirm that the tx started bridging
 */
export class PortBridgerCronExecutor extends RosenPortCronExecutor {
  rosenUI: RosenUserInterface;
  dbClient: RosenPortDBClient;
  constructor(
    cronTimeString: string,
    rosenUI: RosenUserInterface,
    dbClient: RosenPortDBClient
  ) {
    super(cronTimeString, CronCategory.PortBridger);
    this.rosenUI = rosenUI;
    this.dbClient = dbClient;
  }

  async getValidContainers(): Promise<Container[]> {
    return await this.dbClient.container.getContainersViaStatus(
      ContainerStatus.filled
    );
  }

  async execute(): Promise<void> {
    // 1. Get all filled Containers
    const containers = await this.getValidContainers();
    const walletClient = new WalletClient(this.dbClient);

    const containerTxStoreClient: ContainerTxStoreClient =
      new ContainerTxStoreClient(this.dbClient);

    // 2. For each containers
    containers.forEach(async (container) => {
      const portBridger = new PortBridger(
        container,
        containerTxStoreClient,
        this.rosenUI,
        walletClient
      );

      await portBridger.execute();
    });
  }
}
