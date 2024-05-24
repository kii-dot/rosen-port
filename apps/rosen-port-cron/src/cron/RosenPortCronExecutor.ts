import * as cron from 'node-cron';
import { ICronExecutor } from './types';
import { Logger } from '../logging';
import { CronCategory } from '../constants/cronConstants';

export abstract class RosenPortCronExecutor implements ICronExecutor {
  cronTimeString: string;
  cronCategory: CronCategory;

  constructor(cronTimeString: string, cronCategory: CronCategory) {
    this.cronTimeString = cronTimeString;
    this.cronCategory = cronCategory;
  }

  abstract execute(): Promise<void>;

  start(): void {
    this.get().start();
  }

  get(): cron.ScheduledTask {
    return cron.schedule(this.cronTimeString, async () => {
      Logger.info(
        '0',
        this.cronCategory,
        `[${this.cronCategory}] Cron starting`
      );
      try {
        await this.execute();

        Logger.info(
          '0',
          this.cronCategory,
          `[${this.cronCategory}] Successfully Executed`
        );
      } catch (error) {
        Logger.error(
          '0',
          this.cronCategory,
          //@ts-ignore
          `[${this.cronCategory}] Failed with ${error.name}: ${error.message}`
        );
      }
    });
  }
}
