import { CronCategory } from '../../constants/cronConstants';
import { RosenPortCronExecutor } from '../../cron/RosenPortCronExecutor';

export class StatusCheckerCronExecutor extends RosenPortCronExecutor {
  constructor(cronTimeString: string) {
    super(cronTimeString, CronCategory.StatusChecker);
  }

  execute(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
