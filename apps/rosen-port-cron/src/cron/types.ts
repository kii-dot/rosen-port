import { ScheduledTask } from 'node-cron';

export interface ICronExecutor {
  start: () => void;
  get: () => ScheduledTask;
}
