import {
  FundDistributorCron,
  PortBridgerCron,
  RefundOperatorCron,
} from './operators';
/**
 * Cron Job needed:
 * 1. Disperse of funds
 * 2. Bridging of funds
 * 3. Checking of Bridged funds
 * 4. Refunds of unbridged funds
 */

PortBridgerCron.start();
RefundOperatorCron.start();
FundDistributorCron.start();
