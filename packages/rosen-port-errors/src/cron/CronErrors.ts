type CronErrorName = 'FUNDS_NOT_BRIDGED_EXCEPTION';

export class CronError extends Error {
  name: CronErrorName;
  message: string;
  cause: any;

  constructor({
    name,
    message,
    cause,
  }: {
    name: CronErrorName;
    message: string;
    cause?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export class FundsNotBridgedException extends CronError {
  constructor(message?: string) {
    super({ name: 'FUNDS_NOT_BRIDGED_EXCEPTION', message: message ?? '' });
  }
}
