import { FundsTo, IChainTx } from '../../../types/ChainTxs';
import { validateDecimalPlaces } from '@rosen-ui/utils';
import { UnsignedErgoTxProxy } from '@rosen-ui/wallet-api';
import { AssetBalance, ErgoBoxProxy } from '@rosen-bridge/ergo-box-selection';
import ergoExplorerClientFactory from '@rosen-clients/ergo-explorer';
import * as wasm from 'ergo-lib-wasm-nodejs';
import {
  createChangeBox,
  getBoxAssets,
  getCoveringBoxes,
  subtractAssetBalance,
  sumAssetBalance,
} from './utils';
import { unsignedTransactionToProxy } from './proxyTransformation';
import { UnsignedPsbtData, ErgoChainConstants } from '@rosen-port/chains';
import { NotImplementedException } from '@rosen-port/errors';

export class ErgoChainTx implements IChainTx {
  async connect(): Promise<boolean> {
    return await ergoConnector.nautilus.connect({ createErgoObject: false });
  }

  async generateDisperseUnsignedTxs(
    to: Array<FundsTo>
  ): Promise<Array<string | UnsignedErgoTxProxy | UnsignedPsbtData>> {
    throw new NotImplementedException();
  }

  async generateTransferUnsignedTx(to: FundsTo): Promise<any> {
    validateDecimalPlaces(to.decimalAmount, to.token.decimals);
    const wallet = await ergoConnector.nautilus.getContext();
    const tokenId = to.token.tokenId;
    const amount = convertNumberToBigint(
      to.decimalAmount * 10 ** to.token.decimals
    );

    const changeAddress = await wallet.get_change_address();
    const walletUtxos = await wallet.get_utxos();
    if (!walletUtxos) throw Error('No InputBox found in wallet.');

    const address = to.toAddress;

    const unsignedTx = await this.generateUnsignedTx({
      changeAddress,
      walletUtxos,
      toAddress: address,
      tokenId,
      amountString: amount.toString(),
    });

    return unsignedTx;
  }

  async generateUnsignedTx({
    changeAddress,
    walletUtxos,
    toAddress,
    tokenId,
    amountString,
  }: {
    changeAddress: string;
    walletUtxos: ErgoBoxProxy[];
    toAddress: string;
    tokenId: string;
    amountString: string;
  }): Promise<UnsignedErgoTxProxy> {
    const height = await this.getHeight();
    const amount = BigInt(amountString);

    // 1. Get the needed amount to transfer (in tokens etc)
    const lockAssets: AssetBalance = {
      nativeToken: ErgoChainConstants.minBoxValue,
      tokens: [],
    };
    if (tokenId === 'erg') {
      /**
       * TODO: fix ergo native token name
       * local:ergo/rosen-bridge/ui#100
       */
      lockAssets.nativeToken = amount;
    } else {
      // lock token
      lockAssets.tokens.push({ id: tokenId, value: amount });
    }

    // 1.5 create Output Box
    const toReceiverBox = this.createOutputBox(
      toAddress,
      height,
      tokenId,
      amount
    );

    // 2. Calculate the total assets needed from wallet
    const requiredAssets = sumAssetBalance(lockAssets, {
      nativeToken: ErgoChainConstants.minBoxValue,
      tokens: [],
    });

    // 3. get input box from wallet
    const inputs = await getCoveringBoxes(
      requiredAssets,
      [],
      new Map(),
      walletUtxos.values()
    );

    // 3.5 Check to see if there is enough assest
    if (!inputs.covered) throw Error('Not enough assets');

    // 4. Get real value of total input assets
    let inputAssets: AssetBalance = {
      nativeToken: 0n,
      tokens: [],
    };

    const unsignedInputs = new wasm.UnsignedInputs();
    inputs.boxes.forEach((box) => {
      unsignedInputs.add(
        wasm.UnsignedInput.from_box_id(wasm.BoxId.from_str(box.boxId))
      );
      inputAssets = sumAssetBalance(inputAssets, getBoxAssets(box));
    });

    // 5. Calculate the difference between the total input assets and output assets
    const changeAssets = subtractAssetBalance(inputAssets, lockAssets);
    changeAssets.nativeToken -= ErgoChainConstants.fee;

    // 6. Create the change box
    const changeBox = createChangeBox(changeAddress, height, changeAssets);

    const feeBox = wasm.ErgoBoxCandidate.new_miner_fee_box(
      wasm.BoxValue.from_i64(
        wasm.I64.from_str(ErgoChainConstants.fee.toString())
      ),
      height
    );

    // 7. Create UnsignedTx
    const txOutputs = new wasm.ErgoBoxCandidates(toReceiverBox);
    txOutputs.add(changeBox);
    txOutputs.add(feeBox);

    const unsignedTx = new wasm.UnsignedTransaction(
      unsignedInputs,
      new wasm.DataInputs(),
      txOutputs
    );

    // 8. Return the unsignedTx
    return unsignedTransactionToProxy(unsignedTx, inputs.boxes);
  }

  getHeight = async (): Promise<number> => {
    const explorerClient = ergoExplorerClientFactory(
      'https://api.ergoplatform.com'
    );
    return Number((await explorerClient.v1.getApiV1Networkstate()).height);
  };

  createOutputBox(
    toAddress: string,
    height: number,
    tokenId: string,
    amount: bigint
  ): wasm.ErgoBoxCandidate {
    const boxErgValue =
      tokenId === 'erg' ? amount : ErgoChainConstants.minBoxValue;
    const outputBox = new wasm.ErgoBoxCandidateBuilder(
      wasm.BoxValue.from_i64(wasm.I64.from_str(boxErgValue.toString())),
      wasm.Contract.pay_to_address(wasm.Address.from_base58(toAddress)),
      height
    );

    if (tokenId !== 'erg') {
      outputBox.add_token(
        wasm.TokenId.from_str(tokenId),
        wasm.TokenAmount.from_i64(wasm.I64.from_str(amount.toString()))
      );
    }

    return outputBox.build();
  }
}

/**
 * remove the decimal points from the input number and
 * convert number to bigInt
 * @param inputNumber
 */
export const convertNumberToBigint = (inputNumber: number): bigint =>
  BigInt(Math.trunc(inputNumber));
