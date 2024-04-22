import { parse } from 'path';

type DBErrorName = 'TX_NOT_AVAILABLE' | 'NO_TXS_FOUND' | 'CONTAINER_NOT_AVAILABLE' | 'NO_CONTAINERS_FOUND';

export class ReturnableError {
  errorName: string;
  message: string;

  constructor({ errorName, message }: { errorName: string; message: string }) {
    this.errorName = errorName;
    this.message = message;
  }
}

export class DBError extends Error {
  name: DBErrorName;
  message: string;
  cause: any;

  constructor({ name, message = '', cause }: { name: DBErrorName; message?: string; cause?: any }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }

  parseError() {
    return `Error [${this.cause.code}]: ${this.cause.message} | details: ${this.cause.details}`;
  }

  get errorMessage() {
    return this.message + ' ' + this.parseError();
  }

  get error() {
    return new ReturnableError({ errorName: this.name, message: this.message });
  }
}

export class TxNotAvailableError extends DBError {
  constructor(txId: string, error: any) {
    const message = `Tx with id ${txId} is not available.`;
    super({ name: 'TX_NOT_AVAILABLE', message, cause: error });
  }
}

export class NoTxFoundError extends DBError {
  constructor(error: any) {
    const message = `No txs found.`;
    super({ name: 'NO_TXS_FOUND', message, cause: error });
  }
}

export class ContainerNotAvailableError extends DBError {
  constructor(containerId: string, error: any) {
    const message = `Container with id ${containerId} is not available.`;
    super({ name: 'CONTAINER_NOT_AVAILABLE', message, cause: error });
  }
}

export class NoContainersFoundError extends DBError {
  constructor(error: any) {
    const message = `No containers found.`;
    super({ name: 'NO_CONTAINERS_FOUND', message, cause: error });
  }
}
