import * as cron from 'node-cron';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';

export const refundOperatorCron = cron.schedule('*/4 * * * * *', async () => {
  Logger.info(
    '0',
    CronCategory.RefundOperator,
    '[RefundOperatorCron] Cron start'
  );
});
