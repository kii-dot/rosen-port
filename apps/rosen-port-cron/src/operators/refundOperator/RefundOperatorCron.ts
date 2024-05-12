import * as cron from 'node-cron';

export const refundOperatorCron = cron.schedule('*/4 * * * * *', async () => {
  console.log('refund');
});
