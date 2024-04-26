import { Networks } from '../constants';
import { ChainNotImplementedError } from '../error/ChainTxErrors';
import { UnsignedPsbtData } from '../types/BitcoinTxTypes';

export class MCPWallet {
  static create({
    network,
    mnemonic,
  }: {
    network: keyof typeof Networks;
    mnemonic: string;
  }) {
    switch (network) {
      case Networks.ergo:
        return new ErgoWallet(mnemonic);
      case Networks.cardano:
        return new CardanoWallet(mnemonic);
      case Networks.bitcoin:
        return new BitcoinWallet(mnemonic);
      default:
        throw new ChainNotImplementedError(network);
    }
  }
}

interface IWallet {
  signAndSubmit: (unsignedTx: string | UnsignedPsbtData) => Promise<string>;
}

class ErgoWallet implements IWallet {
  constructor(mnemonic: string) {}

  async signAndSubmit(unsignedTx: string | UnsignedPsbtData): Promise<string> {
    const signedTx = await wallet.sign_tx(unsignedTx);
    const result = await wallet.submit_tx(signedTx);
    return result;
  }
}

class BitcoinWallet implements IWallet {
  constructor(mnemonic: string) {}

  async signAndSubmit(unsignedTx: string | UnsignedPsbtData): Promise<string> {
    const result: string = await new Promise((resolve, reject) => {
      getXdefiWallet().api.signTransaction({
        payload: {
          network: {
            type: BitcoinNetworkType.Mainnet,
          },
          message: 'Sign Transaction',
          psbtBase64: unsignedTx.psbt,
          broadcast: false,
          inputsToSign: [
            {
              address: userAddress,
              signingIndexes: Array.from(Array(unsignedTx.inputSize).keys()),
              sigHash: SigHash.SINGLE | SigHash.DEFAULT_ANYONECANPAY,
            },
          ],
        },
        onFinish: (response) => {
          const signedPsbtBase64 = response.psbtBase64;
          submitTransaction(signedPsbtBase64)
            .then((result) => resolve(result))
            .catch((e) => reject(e));
        },
        onCancel: () => {
          reject();
        },
      });
    });
    return result;
  }
}

class CardanoWallet implements IWallet {
  constructor(mnemonic: string) {}
  async signAndSubmit(unsignedTx: string | UnsignedPsbtData): Promise<string> {
    const signedTxHex = await setTxWitnessSet(
      unsignedTx,
      await wallet.signTx(unsignedTx, false)
    );

    const result = await wallet.submitTx(signedTxHex);

    return result;
  }
}
