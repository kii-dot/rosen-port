import { RosenChainToken } from '@rosen-bridge/tokens';
import { RawWallet, Wallet } from '@rosen-ui/wallet-api';
import { ReactNode, FC } from 'react';
import { ConnectorAPI } from '..';
import { validateDecimalPlaces } from '@rosen-ui/utils';
import { convertNumberToBigint, hexToCbor } from '../../_utils';
import {
  generateLockAuxiliaryData,
  setTxWitnessSet,
} from './transaction/utils';
import { generateUnsignedTx } from './transaction/generateTx';

export class CardanoWallet implements Wallet {
  wallet: RawWallet<ConnectorAPI>;

  constructor(wallet: RawWallet<ConnectorAPI>) {
    this.wallet = wallet;
  }

  async getBalance(token: RosenChainToken): Promise<number> {
    return 2;
  }

  async transfer(
    token: RosenChainToken,
    decimalAmount: number,
    toChain: string,
    toAddress: string,
    decimalBridgeFee: number,
    decimalNetworkFee: number,
    lockAddress: string
  ): Promise<string> {
    validateDecimalPlaces(decimalAmount, token.decimals);
    validateDecimalPlaces(decimalBridgeFee, token.decimals);
    validateDecimalPlaces(decimalNetworkFee, token.decimals);

    const wallet = await this.wallet.api.enable();
    const policyIdHex = token.policyId;
    const assetNameHex = token.assetName;
    const amount = convertNumberToBigint(decimalAmount * 10 ** token.decimals);
    const bridgeFee = convertNumberToBigint(
      decimalBridgeFee * 10 ** token.decimals
    );
    const networkFee = convertNumberToBigint(
      decimalNetworkFee * 10 ** token.decimals
    );
    const changeAddressHex = await wallet.getChangeAddress();

    const auxiliaryDataHex = await generateLockAuxiliaryData(
      toChain,
      toAddress,
      changeAddressHex,
      networkFee.toString(),
      bridgeFee.toString()
    );

    const walletUtxos = await wallet.getUtxos();
    if (!walletUtxos) throw Error(`Failed to fetch wallet utxos`);
    const unsignedTxHex = await generateUnsignedTx(
      walletUtxos,
      lockAddress,
      changeAddressHex,
      policyIdHex,
      assetNameHex,
      amount.toString(),
      auxiliaryDataHex
    );

    const signedTxHex = await setTxWitnessSet(
      unsignedTxHex,
      await wallet.signTx(unsignedTxHex, false)
    );

    const result = await wallet.submitTx(signedTxHex);
    return result;
  }

  onConnect() {
    if (this.wallet.onConnect) {
      this.wallet.onConnect();
    } else {
      throw 'No Function Exception';
    }
  }

  onDisconnect() {
    if (this.wallet.onDisconnect) {
      this.wallet.onDisconnect();
    } else {
      throw 'No Function Exception';
    }
  }

  connectWallet(): Promise<ReactNode> {
    return this.wallet.connectWallet();
  }

  get hidden(): boolean | undefined {
    return this.wallet.hidden;
  }

  get icon(): FC {
    return this.wallet.icon;
  }

  get name(): string {
    return this.wallet.name;
  }

  get label(): string {
    return this.wallet.label;
  }

  get link(): string {
    return this.wallet.link;
  }
}
