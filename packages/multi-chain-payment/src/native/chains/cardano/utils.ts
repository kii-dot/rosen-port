import cardanoKoiosClientFactory from '@rosen-clients/cardano-koios';
import { CardanoProtocolParams } from '@rosen-port/chains';
import * as wasm from '@emurgo/cardano-serialization-lib-nodejs';
import {
  AssetBalance,
  CardanoAsset,
  CardanoUtxo,
} from '@rosen-bridge/cardano-utxo-selection';

/**
 * gets Cardano protocol params
 * @returns
 */
export const getCardanoProtocolParams =
  async (): Promise<CardanoProtocolParams> => {
    const cardanoKoiosClient = cardanoKoiosClientFactory(
      process.env.CARDANO_KOIOS_API!
    );
    return await cardanoKoiosClient.getEpochParams().then((epochParams) => {
      const params = epochParams[0];
      if (
        !params.min_fee_a ||
        !params.min_fee_b ||
        !params.pool_deposit ||
        !params.key_deposit ||
        !params.max_val_size ||
        !params.max_tx_size ||
        !params.coins_per_utxo_size
      )
        throw Error(
          `Some required Cardano protocol params fetched from koios are undefined or null `
        );
      return {
        min_fee_a: params.min_fee_a,
        min_fee_b: params.min_fee_b,
        pool_deposit: params.pool_deposit,
        key_deposit: params.key_deposit,
        max_value_size: params.max_val_size,
        max_tx_size: params.max_tx_size,
        coins_per_utxo_size: params.coins_per_utxo_size,
      };
    });
  };

/**
 * generates transaction builder config using protocol params
 * @param params
 * @returns
 */
export const getTxBuilderConfig = (
  params: CardanoProtocolParams
): wasm.TransactionBuilderConfig => {
  return wasm.TransactionBuilderConfigBuilder.new()
    .fee_algo(
      wasm.LinearFee.new(
        wasm.BigNum.from_str(params.min_fee_a.toString()),
        wasm.BigNum.from_str(params.min_fee_b.toString())
      )
    )
    .pool_deposit(wasm.BigNum.from_str(params.pool_deposit))
    .key_deposit(wasm.BigNum.from_str(params.key_deposit))
    .coins_per_utxo_byte(wasm.BigNum.from_str(params.coins_per_utxo_size))
    .max_value_size(params.max_value_size)
    .max_tx_size(params.max_tx_size)
    .prefer_pure_change(true)
    .build();
};

/**
 * converts utxo type from wallet type to CardanoUtxo
 * @param serializedUtxo serialized hex string of TransactionUnspentOutput
 */
export const walletUtxoToCardanoUtxo = (
  serializedUtxo: string
): CardanoUtxo => {
  const utxo = wasm.TransactionUnspentOutput.from_hex(serializedUtxo);
  const assets: Array<CardanoAsset> = [];

  const multiAsset = utxo.output().amount().multiasset();
  if (multiAsset) {
    for (let i = 0; i < multiAsset.keys().len(); i++) {
      const policyId = multiAsset.keys().get(i);
      const policyAssets = multiAsset.get(policyId)!;
      for (let j = 0; j < policyAssets.len(); j++) {
        const assetName = policyAssets.keys().get(j);
        assets.push({
          policyId: policyId.to_hex(),
          assetName: Buffer.from(assetName.name()).toString('hex'),
          quantity: BigInt(policyAssets.get(assetName)!.to_str()),
        });
      }
    }
  }

  return {
    txId: utxo.input().transaction_id().to_hex(),
    index: utxo.input().index(),
    value: BigInt(utxo.output().amount().coin().to_str()),
    assets: assets,
    address: utxo.output().address().to_bech32(),
  };
};

/**
 * generates cardano box in TransactionOutput type
 * @param balance
 * @param address
 * @returns
 */
export const generateOutputBox = (
  balance: AssetBalance,
  address: string,
  coinsPerUtxoByte: string
): wasm.TransactionOutput => {
  let changeBoxBuilder = wasm.TransactionOutputBuilder.new()
    .with_address(wasm.Address.from_bech32(address))
    .next();

  let multiAsset = wasm.MultiAsset.new();
  balance.tokens.forEach((token) => {
    const assetUnit = token.id.split('.');
    const policyId = wasm.ScriptHash.from_hex(assetUnit[0]);
    const assetName = wasm.AssetName.new(Buffer.from(assetUnit[1], 'hex'));
    multiAsset.set_asset(
      policyId,
      assetName,
      wasm.BigNum.from_str(token.value.toString())
    );
  });

  return balance.nativeToken
    ? changeBoxBuilder
        .with_value(
          wasm.Value.new_with_assets(
            wasm.BigNum.from_str(balance.nativeToken.toString()),
            multiAsset
          )
        )
        .build()
    : changeBoxBuilder
        .with_asset_and_min_required_coin_by_utxo_cost(
          multiAsset,
          wasm.DataCost.new_coins_per_byte(
            wasm.BigNum.from_str(coinsPerUtxoByte)
          )
        )
        .build();
};
