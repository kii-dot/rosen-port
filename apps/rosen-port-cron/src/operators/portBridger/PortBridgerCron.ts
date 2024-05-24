import { CronCategory } from '../../constants/cronConstants';
import { dbClient } from '../../tools/db';
import { Container, ContainerStatus } from '@rosen-port/db';
import { PortBridger } from './PortBridger';
import { RosenPortCronExecutor } from '../../cron/RosenPortCronExecutor';

/**
 * The goal of this cron job is to:
 * Check to see if Rosen-port-wallet has the right funds.
 * Bridge the funds from Rosen-port-wallet to the dest chain wallet
 * Confirm that the tx started bridging
 */
export class PortBridgerCronExecutor extends RosenPortCronExecutor {
  constructor(cronTimeString: string) {
    super(cronTimeString, CronCategory.PortBridger);
  }

  async getValidContainers(): Promise<Container[]> {
    return await dbClient.container.getContainersViaStatus(
      ContainerStatus.filled
    );
  }

  async execute(): Promise<void> {
    // 1. Get all filled Containers
    const containers = await this.getValidContainers();

    // 2. For each containers
    containers.forEach(async (container) => {
      const portBridger = new PortBridger(container, dbClient);

      await portBridger.execute();
    });
  }
}
