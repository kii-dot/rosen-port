import { ErgoUnsignedTransaction } from '@fleet-sdk/core';
import { EIP12UnsignedTransaction } from '@fleet-sdk/common';
import { ChainNotImplementedError } from '../error/ChainTxErrors';
import { UnsignedPsbtData, Networks } from '@rosen-port/chains';
import { NotImplementedException } from '@rosen-port/errors';
import {
  Wallet as ErgoBackendWallet,
  ErgoNodeAPI,
} from '@rosen-port/ergo-explorer-node';
import { ErgoBoxProxy } from '@rosen-ui/wallet-api';
import { CardanoUtxo } from '@rosen/sdk';

export interface IMCPWallet {
  create(mnemonic: string): IWallet;
}

export class MCPWallet implements IMCPWallet {
  network: keyof typeof Networks;
  constructor(network: keyof typeof Networks) {
    this.network = network;
  }

  create(mnemonic: string): IWallet {
    switch (this.network) {
      case Networks.ergo:
        return new ErgoWallet(mnemonic);
      case Networks.cardano:
        return new CardanoWallet(mnemonic);
      case Networks.bitcoin:
        return new BitcoinWallet(mnemonic);
      default:
        throw new ChainNotImplementedError(this.network);
    }
  }
}

export interface IWallet {
  signAndSubmit: (
    unsignedTx: string | UnsignedPsbtData | EIP12UnsignedTransaction
  ) => Promise<string>;

  address: () => Promise<string>;

  getUtxos: () => Promise<ErgoBoxProxy[] | CardanoUtxo[]>;
}

class ErgoWallet implements IWallet {
  wallet: ErgoBackendWallet;
  nodeApi: ErgoNodeAPI;
  walletIndex: number;
  constructor(mnemonic: string) {
    this.wallet = new ErgoBackendWallet(mnemonic);
    this.nodeApi = new ErgoNodeAPI();
    // @todo kii make sure this is fixed, it should be in constructor?
    this.walletIndex = 0;
  }

  async getUtxos(): Promise<ErgoBoxProxy[] | CardanoUtxo[]> {
    throw new NotImplementedException();
  }

  async address(): Promise<string> {
    return this.wallet.getAddress(0);
  }

  async signAndSubmit(
    unsignedTx: string | UnsignedPsbtData | EIP12UnsignedTransaction
  ): Promise<string> {
    const currentHeight = await this.nodeApi.getHeight();
    if (!currentHeight) {
      throw new Error('issue current height');
    }

    const blockHeaders = (
      await this.nodeApi.getBlockByHeight(currentHeight - 9, currentHeight)
    ).reverse();

    if (blockHeaders.length === 0) {
      throw new Error('issue getting block headers');
    }

    const signedTx = await this.wallet.signTransaction(
      // @ts-ignore
      unsignedTx,
      blockHeaders,
      this.walletIndex
    );

    const txId = this.nodeApi.submitTransaction(signedTx);
    return txId;
  }
}

class BitcoinWallet implements IWallet {
  constructor(mnemonic: string) {}

  async signAndSubmit(
    unsignedTx: string | UnsignedPsbtData | EIP12UnsignedTransaction
  ): Promise<string> {
    // const result: string = await new Promise((resolve, reject) => {
    //   getXdefiWallet().api.signTransaction({
    //     payload: {
    //       network: {
    //         type: BitcoinNetworkType.Mainnet,
    //       },
    //       message: 'Sign Transaction',
    //       psbtBase64: unsignedTx.psbt,
    //       broadcast: false,
    //       inputsToSign: [
    //         {
    //           address: userAddress,
    //           signingIndexes: Array.from(Array(unsignedTx.inputSize).keys()),
    //           sigHash: SigHash.SINGLE | SigHash.DEFAULT_ANYONECANPAY,
    //         },
    //       ],
    //     },
    //     onFinish: (response) => {
    //       const signedPsbtBase64 = response.psbtBase64;
    //       submitTransaction(signedPsbtBase64)
    //         .then((result) => resolve(result))
    //         .catch((e) => reject(e));
    //     },
    //     onCancel: () => {
    //       reject();
    //     },
    //   });
    // });
    // return result;

    throw new NotImplementedException();
  }
  async address(): Promise<string> {
    throw new NotImplementedException();
  }
  async getUtxos(): Promise<ErgoBoxProxy[] | CardanoUtxo[]> {
    throw new NotImplementedException();
  }
}

class CardanoWallet implements IWallet {
  constructor(mnemonic: string) {}
  async getUtxos(): Promise<ErgoBoxProxy[] | CardanoUtxo[]> {
    throw new NotImplementedException();
  }

  async signAndSubmit(
    unsignedTx: string | UnsignedPsbtData | EIP12UnsignedTransaction
  ): Promise<string> {
    // const signedTxHex = await setTxWitnessSet(
    //   unsignedTx,
    //   await wallet.signTx(unsignedTx, false)
    // );
    // const result = await wallet.submitTx(signedTxHex);

    // return result;

    throw new NotImplementedException();
  }

  async address(): Promise<string> {
    throw new NotImplementedException();
  }
}
