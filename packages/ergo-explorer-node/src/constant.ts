export interface IErgoExplorerUrl {
  mainnet: string;
  testnet: string;
}

export class ErgoExplorerUrl implements IErgoExplorerUrl {
  mainnet: string;
  testnet: string;

  constructor(mainnet: string, testnet: string) {
    this.mainnet = mainnet;
    this.testnet = testnet;
  }

  static getDefault() {
    const mainnet = 'https://api.ergoplatform.com';
    const testnet = 'https://api-testnet.ergoplatform.com';
    return new ErgoExplorerUrl(mainnet, testnet);
  }
}

export interface IErgoNodeUrl {
  mainnet: string;
  testnet: string;
}

export class ErgoNodeUrl implements IErgoNodeUrl {
  mainnet: string;
  testnet: string;

  constructor(mainnet: string, testnet: string) {
    this.mainnet = mainnet;
    this.testnet = testnet;
  }

  static getDefault() {
    const mainnet = 'http://213.239.193.208:9053';
    const testnet = 'http://213.239.193.208:9052';
    return new ErgoNodeUrl(mainnet, testnet);
  }
}

export enum ErgoNetwork {
  testnet = 'testnet',
  mainnet = 'mainnet',
}
