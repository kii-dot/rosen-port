import { Container, ContainerStatus, RosenPortDBClient } from '@rosen-port/db';
import { FundDistributor } from './FundDistributor';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';
import { RosenPortCronExecutor } from '../../cron/RosenPortCronExecutor';
import { FundDistributorStoreClient } from './storeClient';
import { WalletClient } from '../../types/executor';
import { RosenUserInterface } from '@rosen/sdk';

export class FundDistributorCronExecutor extends RosenPortCronExecutor {
  rosenUserInterface: RosenUserInterface;
  dbClient: RosenPortDBClient;
  constructor(
    cronTimeString: string,
    rosenUserInterface: RosenUserInterface,
    dbClient: RosenPortDBClient
  ) {
    super(cronTimeString, CronCategory.FundDistributor);
    this.rosenUserInterface = rosenUserInterface;
    this.dbClient = dbClient;
  }

  async getValidContainers(): Promise<Container[]> {
    return await this.dbClient.container.getContainersViaStatus(
      ContainerStatus.bridged
    );
  }

  async execute(): Promise<void> {
    // 1. Get all containers that are bridged
    const containers = await this.getValidContainers();

    Logger.info(
      '0',
      CronCategory.FundDistributor,
      `[FundDistributor] Retrieved ${containers.length} bridged containers to process`
    );

    const fundDistributorStoreClient: FundDistributorStoreClient =
      new FundDistributorStoreClient(this.dbClient);
    const walletClient: WalletClient = new WalletClient(this.dbClient);
    // 2. For each container
    containers.forEach(async (container) => {
      const fundDistributor = new FundDistributor(
        container,
        fundDistributorStoreClient,
        this.rosenUserInterface,
        walletClient
      );
      await fundDistributor.execute();
    });
  }
}
