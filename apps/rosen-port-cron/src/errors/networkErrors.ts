type NetworkErrorName = 'NETWORK_NOT_SET_EXCEPTION';

export class NetworkError extends Error {
  name: NetworkErrorName;
  message: string;
  cause: any;

  constructor({
    name,
    message,
    cause,
  }: {
    name: NetworkErrorName;
    message: string;
    cause?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export class NetworkNotSetException extends NetworkError {
  constructor(message?: string) {
    super({ name: 'NETWORK_NOT_SET_EXCEPTION', message: message ?? '' });
  }
}
