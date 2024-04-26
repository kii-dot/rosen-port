import { RosenChainToken } from '@rosen-bridge/tokens';
import { IChainTx } from '../../../types/ChainTxs';
import { validateDecimalPlaces } from '@rosen-ui/utils';
import { convertNumberToBigint } from '../ergo';
import * as wasm from '@emurgo/cardano-serialization-lib-nodejs';
import {
  generateOutputBox,
  getCardanoProtocolParams,
  getTxBuilderConfig,
  walletUtxoToCardanoUtxo,
} from './utils';
import {
  AssetBalance,
  selectCardanoUtxos,
} from '@rosen-bridge/cardano-utxo-selection';
import { ADA_POLICY_ID } from '../../../types/CardanoChainTypes';
import { feeAndMinBoxValue } from '../../../constants/CardanoChainConstants';
import {
  getUtxoAssets,
  subtractAssetBalance,
  sumAssetBalance,
} from './assetCalculator';

export class CardanoChainTx implements IChainTx {
  async connect(): Promise<boolean> {
    return true;
  }

  async generateUnsignedTransferTx(
    token: RosenChainToken,
    decimalAmount: number,
    toAddress: string
  ): Promise<any> {
    validateDecimalPlaces(decimalAmount, token.decimals);

    // 1. Get Cardano wallet
    const wallet = await cardano.lace.enable();
    const policyIdHex = token.policyId;
    const assetNameHex = token.assetName;
    const amount = convertNumberToBigint(decimalAmount * 10 ** token.decimals);

    const changeAddressHex = await wallet.getChangeAddress();
    // @todo kii check if we need auxiliaryDataHex

    const walletUtxos = await wallet.getUtxos();
    if (!walletUtxos) throw Error(`Failed to fetch wallet utxos`);
    return await this.generateUnsignedTx(
      walletUtxos,
      toAddress,
      changeAddressHex,
      policyIdHex,
      assetNameHex,
      amount.toString()
    );
  }

  async generateUnsignedTx(
    walletUtxos: string[],
    lockAddress: string,
    changeAddressHex: string,
    policyIdHex: string,
    assetNameHex: string,
    amountString: string
  ): Promise<string> {
    const amount = BigInt(amountString);

    const changeAddress = wasm.Address.from_hex(changeAddressHex).to_bech32();
    // 1. Create TxBuilder
    // generate txBuilder
    const protocolParams = await getCardanoProtocolParams();
    const txBuilder = wasm.TransactionBuilder.new(
      getTxBuilderConfig(protocolParams)
    );

    // 2. Create Output Box
    // generate lock box
    const lockAssets: AssetBalance = {
      nativeToken: 0n,
      tokens: [],
    };
    if (policyIdHex === ADA_POLICY_ID) {
      // lock ADA
      lockAssets.nativeToken = amount;
    } else {
      // lock asset
      lockAssets.tokens.push({
        id: `${policyIdHex}.${assetNameHex}`,
        value: amount,
      });
    }
    const lockBox = generateOutputBox(
      lockAssets,
      lockAddress,
      protocolParams.coins_per_utxo_size
    );

    // 3. With the output box
    // calculate the required assets to get the amount in input boxes
    lockAssets.nativeToken = BigInt(lockBox.amount().coin().to_str());
    const requiredAssets: AssetBalance = structuredClone(lockAssets);

    // 4. Put Outputbox into txBuilder
    txBuilder.add_output(lockBox);

    const walletUtxosAsCardanoUtxos = await Promise.all(
      walletUtxos.map(walletUtxoToCardanoUtxo)
    );
    // add required ADA estimation for tx fee and change box
    requiredAssets.nativeToken += feeAndMinBoxValue;
    // get input boxes
    const inputs = await selectCardanoUtxos(
      requiredAssets,
      [],
      new Map(),
      walletUtxosAsCardanoUtxos.values()
    );
    if (!inputs.covered) throw Error(`Not enough assets`);
    let inputAssets: AssetBalance = {
      nativeToken: 0n,
      tokens: [],
    };
    // add input boxes to transaction
    inputs.boxes.forEach((utxo) => {
      inputAssets = sumAssetBalance(inputAssets, getUtxoAssets(utxo));
      txBuilder.add_input(
        wasm.Address.from_bech32(utxo.address),
        wasm.TransactionInput.new(
          wasm.TransactionHash.from_hex(utxo.txId),
          utxo.index
        ),
        lockBox.amount()
      );
    });

    // set temp fee and auxiliary data
    txBuilder.set_fee(txBuilder.min_fee());

    // calculate change box assets and transaction fee
    const changeAssets = subtractAssetBalance(inputAssets, lockAssets);
    const tempChangeBox = generateOutputBox(
      changeAssets,
      changeAddress,
      protocolParams.coins_per_utxo_size
    );
    const fee = txBuilder
      .min_fee()
      .checked_add(txBuilder.fee_for_output(tempChangeBox));
    changeAssets.nativeToken -= BigInt(fee.to_str());
    const changeBox = generateOutputBox(
      changeAssets,
      changeAddress,
      protocolParams.coins_per_utxo_size
    );
    txBuilder.add_output(changeBox);

    // set tx fee
    txBuilder.set_fee(fee);

    // build transaction
    const txBody = txBuilder.build();

    // build unsigned transaction object
    const witnessSet = wasm.TransactionWitnessSet.new();
    const tx = wasm.Transaction.new(txBody, witnessSet);
    return tx.to_hex();
  }
}
