import * as cron from 'node-cron';
import { Logger, pinoLogger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';

export const portBridgerCron = cron.schedule('*/4 * * * * *', async () => {
  Logger.info('0', CronCategory.PortBridger, '[PortBridgerCron] Cron start');
});
