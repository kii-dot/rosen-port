type ChainErrorName = 'CHAIN_DOES_NOT_EXIST_ERROR';

export class ChainError extends Error {
  name: ChainErrorName;
  message: string;
  cause: any;

  constructor({ name, message, cause }: { name: ChainErrorName; message: string; cause?: any }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export class ChainDoesNotExistError extends ChainError {
  constructor(chainName: string | null) {
    const message = chainName === null ? 'Chain is not defined' : `${chainName} does not exist`;
    super({ name: 'CHAIN_DOES_NOT_EXIST_ERROR', message: message });
  }
}
