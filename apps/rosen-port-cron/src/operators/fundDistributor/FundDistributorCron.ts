import { dbClient } from '../../tools/db';
import { Container, ContainerStatus } from '@rosen-port/db';
import { TokenMap } from '@rosen-bridge/tokens';
import { FundDistributor } from './FundDistributor';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';
import { RosenPortCronExecutor } from '../../cron/RosenPortCronExecutor';
import { tokenMap } from '../../tools/tokenMap';

export class FundDistributorCronExecutor extends RosenPortCronExecutor {
  tokenMap: TokenMap;
  constructor(cronTimeString: string) {
    super(cronTimeString, CronCategory.FundDistributor);
    this.tokenMap = tokenMap;
  }

  async getValidContainers(): Promise<Container[]> {
    return await dbClient.container.getContainersViaStatus(
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

    // 2. For each container
    containers.forEach(async (container) => {
      const fundDistributor = new FundDistributor(
        this.tokenMap,
        container,
        dbClient
      );
      await fundDistributor.execute();
    });
  }
}
