type DBErrorName = 'DB_UPDATE_FAILURE';

export class DBError extends Error {
  name: DBErrorName;
  message: string;
  cause: any;

  constructor({
    name,
    message,
    cause,
  }: {
    name: DBErrorName;
    message: string;
    cause?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export class DBUpdateFailureException extends DBError {
  constructor(message?: string) {
    super({ name: 'DB_UPDATE_FAILURE', message: message ?? '' });
  }
}
