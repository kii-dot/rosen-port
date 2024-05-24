import { CronCategory } from '../constants/cronConstants';
import {
  FundDistributorCronExecutor,
  PortBridgerCronExecutor,
  RefundOperatorCronExecutor,
} from '../operators';
import { StatusCheckerCronExecutor } from '../operators/statusChecker';
import { ICronExecutor } from './types';

export class RosenPortCronFactory {
  static get(category: CronCategory, cronTime: string): ICronExecutor {
    switch (category) {
      case CronCategory.FundDistributor:
        return new FundDistributorCronExecutor(cronTime);
      case CronCategory.PortBridger:
        return new PortBridgerCronExecutor(cronTime);
      case CronCategory.RefundOperator:
        return new RefundOperatorCronExecutor(cronTime);
      case CronCategory.StatusChecker:
        return new StatusCheckerCronExecutor(cronTime);
      default:
        throw new Error('Cron Category invalid');
    }
  }
}
