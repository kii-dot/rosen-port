import * as cron from 'node-cron';

export const portBridgerCron = cron.schedule('*/4 * * * * *', async () => {
  console.log('port bridger');
});
