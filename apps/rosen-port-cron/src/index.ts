import { CronCategory } from './constants/cronConstants';
import { TimeType, getCronString, RosenPortCronFactory } from './cron';
/**
 * Cron Job needed:
 * 1. Disperse of funds
 * 2. Bridging of funds
 * 3. Checking of Bridged funds
 * 4. Refunds of unbridged funds
 */

const thirtySeconds = {
  value: 5,
  time: TimeType.seconds,
};

const thirtySecondCronString = getCronString(thirtySeconds);

const PortBridgerCron = RosenPortCronFactory.get(
  CronCategory.PortBridger,
  thirtySecondCronString
);
PortBridgerCron.start();

const RefundOperatorCron = RosenPortCronFactory.get(
  CronCategory.RefundOperator,
  thirtySecondCronString
);
RefundOperatorCron.start();

const FundDistributorCron = RosenPortCronFactory.get(
  CronCategory.FundDistributor,
  thirtySecondCronString
);
FundDistributorCron.start();
