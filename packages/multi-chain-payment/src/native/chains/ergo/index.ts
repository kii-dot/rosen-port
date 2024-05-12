import { FundsTo, IChainTx } from '../../../types/ChainTxs';
import { validateDecimalPlaces } from '@rosen-ui/utils';
import { EipWalletApi } from '@rosen-ui/wallet-api';
import { ErgoBoxProxy } from '@rosen-bridge/ergo-box-selection';
import { UnsignedPsbtData, ErgoChainConstants } from '@rosen-port/chains';
import { ErgoExplorerAPI, ErgoNodeAPI } from '@rosen-port/ergo-explorer-node';
import { EIP12UnsignedTransaction } from '@fleet-sdk/common';
import {
  Amount,
  Box,
  OutputBuilder,
  TransactionBuilder,
} from '@fleet-sdk/core';

export class ErgoChainTx implements IChainTx {
  nodeAPI: ErgoNodeAPI;
  explorerAPI: ErgoExplorerAPI;
  senderAddress: string;

  constructor(
    senderAddress: string = '',
    nodeApi: ErgoNodeAPI = new ErgoNodeAPI(),
    explorerApi: ErgoExplorerAPI = new ErgoExplorerAPI()
  ) {
    this.nodeAPI = nodeApi;
    this.explorerAPI = explorerApi;
    this.senderAddress = senderAddress;
  }

  async connect(): Promise<boolean> {
    return await ergoConnector.nautilus.connect({ createErgoObject: false });
  }

  async wallet(): Promise<EipWalletApi> {
    return await ergoConnector.nautilus.getContext();
  }

  async changeAddress(useWallet: boolean = false): Promise<string> {
    return useWallet
      ? await (await this.wallet()).get_change_address()
      : this.senderAddress;
  }

  generateOutput(to: FundsTo): OutputBuilder {
    validateDecimalPlaces(to.decimalAmount, to.token.decimals);
    const amount = convertNumberToBigint(
      to.decimalAmount * 10 ** to.token.decimals
    );

    if (to.token.name === 'ERG') {
      return new OutputBuilder(amount, to.toAddress);
    }

    return new OutputBuilder(
      ErgoChainConstants.minBoxValue,
      to.toAddress
    ).addTokens([
      {
        tokenId: to.token.id,
        amount: BigInt(amount),
      },
    ]);
  }

  async getInputs(useWallet: boolean = false): Promise<Array<Box<Amount>>> {
    var inputs: Array<ErgoBoxProxy | Box<Amount>> = [];
    if (useWallet) {
      const wallet = await this.wallet();
      const walletInputs = await wallet.get_utxos();
      inputs.push.apply(walletInputs);
    } else {
      const explorerInputs = await this.explorerAPI.getUnspentBoxesByAddress(
        this.senderAddress
      );

      explorerInputs.forEach((input) => {
        inputs.push(input);
      });
    }

    return inputs;
  }

  async generateDisperseUnsignedTxs(
    to: Array<FundsTo>,
    useWallet: boolean = false
  ): Promise<string | EIP12UnsignedTransaction | UnsignedPsbtData> {
    const inputs = await this.getInputs(useWallet);
    const height = await this.getHeight();
    const changeAddress: string = await this.changeAddress();

    // Create Outputs
    const outputs = to.map((fundsTo) => {
      return this.generateOutput(fundsTo);
    });

    return new TransactionBuilder(height)
      .from(inputs)
      .to(outputs)
      .sendChangeTo(changeAddress)
      .payMinFee()
      .build()
      .toEIP12Object();
  }

  async generateTransferUnsignedTx(
    to: FundsTo,
    useWallet: boolean = false
  ): Promise<any> {
    const changeAddress = await this.changeAddress(useWallet);
    const inputs = await this.getInputs(useWallet);
    if (inputs.length <= 0) throw Error('No InputBox found in wallet.');

    const outputs = this.generateOutput(to);

    return new TransactionBuilder(await this.getHeight())
      .from(inputs)
      .to(outputs)
      .sendChangeTo(changeAddress)
      .payMinFee()
      .build();
  }

  getHeight = async (): Promise<number> => {
    const networkState = await this.explorerAPI.getNetworkState();
    return Number(networkState.height);
  };
}

/**
 * remove the decimal points from the input number and
 * convert number to bigInt
 * @param inputNumber
 */
export const convertNumberToBigint = (inputNumber: number): bigint =>
  BigInt(Math.trunc(inputNumber));
