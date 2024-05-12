import pino from 'pino';
import { CronCategory } from '../constants/cronConstants';

const logPath = './logs/app.log';
const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: {
        destination: logPath,
        mkdir: true,
      },
    },
    {
      target: 'pino-pretty',
      options: { colorize: true, singleLine: true, destination: 1 },
    },
  ],
});

export const pinoLogger = pino(transport);

export class Logger {
  static info(
    tag: string,
    category: CronCategory,
    msg: string,
    ...args: any[]
  ) {
    const appInfo = {
      category,
      tag,
    };

    pinoLogger.info(appInfo, msg, args);
  }

  static warn(
    tag: string,
    category: CronCategory,
    msg: string,
    ...args: any[]
  ) {
    const appInfo = {
      category,
      tag,
    };

    pinoLogger.warn(appInfo, msg, args);
  }

  static debug(
    tag: string,
    category: CronCategory,
    msg: string,
    ...args: any[]
  ) {
    const appInfo = {
      category,
      tag,
    };

    pinoLogger.debug(appInfo, msg, args);
  }

  static error(
    tag: string,
    category: CronCategory,
    msg: string,
    ...args: any[]
  ) {
    const appInfo = {
      category,
      tag,
    };

    pinoLogger.error(appInfo, msg, args);
  }

  static fatal(
    tag: string,
    category: CronCategory,
    msg: string,
    ...args: any[]
  ) {
    const appInfo = {
      category,
      tag,
    };

    pinoLogger.fatal(appInfo, msg, args);
  }
}
