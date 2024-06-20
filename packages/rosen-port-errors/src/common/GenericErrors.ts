type GenericErrorName = 'NOT_IMPLEMENTED_ERROR';

export class GenericError extends Error {
  name: GenericErrorName;
  message: string;
  cause: any;

  constructor({
    name,
    message,
    cause,
  }: {
    name: GenericErrorName;
    message: string;
    cause?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export class NotImplementedException extends GenericError {
  constructor(message?: string) {
    super({ name: 'NOT_IMPLEMENTED_ERROR', message: message ?? '' });
  }
}
