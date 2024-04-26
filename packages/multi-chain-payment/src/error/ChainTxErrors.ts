type ChainTxErrorName = 'CHAIN_NOT_IMPLEMENTED_ERROR';

export class ChainTxError extends Error {
  name: ChainTxErrorName;
  message: string;
  cause: any;

  constructor({
    name,
    message,
    cause,
  }: {
    name: ChainTxErrorName;
    message: string;
    cause?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export class ChainNotImplementedError extends ChainTxError {
  constructor(chainName: string | null) {
    const message =
      chainName === null
        ? 'Chain is not implemented'
        : `${chainName} is not implemented`;
    super({ name: 'CHAIN_NOT_IMPLEMENTED_ERROR', message: message });
  }
}
