import { CronCategory } from '../constants/cronConstants';
import {
  FundDistributorCronExecutor,
  PortBridgerCronExecutor,
  RefundOperatorCronExecutor,
} from '../operators';
import { StatusCheckerCronExecutor } from '../operators/statusChecker';
import { dbClient } from '../tools/db';
import { rosenUI } from '../tools/rosen';
import { ICronExecutor } from './types';

export class RosenPortCronFactory {
  static get(category: CronCategory, cronTime: string): ICronExecutor {
    switch (category) {
      case CronCategory.FundDistributor:
        return new FundDistributorCronExecutor(cronTime, rosenUI, dbClient);
      case CronCategory.PortBridger:
        return new PortBridgerCronExecutor(cronTime, rosenUI, dbClient);
      case CronCategory.RefundOperator:
        return new RefundOperatorCronExecutor(cronTime, rosenUI, dbClient);
      case CronCategory.StatusChecker:
        return new StatusCheckerCronExecutor(cronTime, rosenUI, dbClient);
      default:
        throw new Error('Cron Category invalid');
    }
  }
}
