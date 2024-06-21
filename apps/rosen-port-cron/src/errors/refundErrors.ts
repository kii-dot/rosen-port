type RefundErrorName =
  | 'REFUND_NOT_FOUND'
  | 'REFUND_SERVICE_FEE_NOT_CONFIRMED_EXCEPTION'
  | 'REFUND_INVALID_EXCEPTION';

export class RefundError extends Error {
  name: RefundErrorName;
  message: string;
  cause: any;

  constructor({
    name,
    message,
    cause,
  }: {
    name: RefundErrorName;
    message: string;
    cause?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export class RefundNotFoundException extends RefundError {
  constructor(message?: string) {
    super({ name: 'REFUND_NOT_FOUND', message: message ?? '' });
  }
}

export class RefundServiceFeeNotConfirmedException extends RefundError {
  constructor(message?: string) {
    super({
      name: 'REFUND_SERVICE_FEE_NOT_CONFIRMED_EXCEPTION',
      message: message ?? '',
    });
  }
}

export class RefundInvalidException extends RefundError {
  constructor(message?: string) {
    super({
      name: 'REFUND_INVALID_EXCEPTION',
      message: message ?? '',
    });
  }
}
