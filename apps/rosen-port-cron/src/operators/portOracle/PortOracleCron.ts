import { RosenUserInterface } from '@rosen/sdk';
import { CronCategory } from '../../constants/cronConstants';
import { RosenPortCronExecutor } from '../../cron/RosenPortCronExecutor';
import { RosenPortDBClient } from '@rosen-port/db';

export class PortOracleCronExecutor extends RosenPortCronExecutor {
  rosenUI: RosenUserInterface;
  dbClient: RosenPortDBClient;

  constructor(
    cronTimeString: string,
    rosenUI: RosenUserInterface,
    dbClient: RosenPortDBClient
  ) {
    super(cronTimeString, CronCategory.StatusChecker);
    (this.rosenUI = rosenUI), (this.dbClient = dbClient);
  }

  execute(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
