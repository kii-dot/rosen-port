import axios from 'axios';
import { BlockHeader } from './types/node.types';
import { ErgoNetwork, ErgoNodeUrl, IErgoNodeUrl } from './constant';
import { SignedTransaction } from '@fleet-sdk/common';

export class ErgoNodeAPI {
  private readonly baseUrl: IErgoNodeUrl;
  network: ErgoNetwork;

  constructor(
    baseUrl: IErgoNodeUrl = ErgoNodeUrl.getDefault(),
    network: ErgoNetwork = ErgoNetwork.mainnet
  ) {
    this.baseUrl = baseUrl;
    this.network = network;
    axios.defaults.headers.common['Accept-Encoding'] = 'gzip';
  }

  getUrl(): string {
    return this.baseUrl[this.network];
  }

  public async submitTransaction(
    transaction: SignedTransaction
  ): Promise<string | undefined> {
    const url = `${this.getUrl()}/transactions`;
    try {
      const response = await axios.post(url, transaction);
      return response.data;
    } catch (error) {
      if ((error as any).response && (error as any).response.data) {
        const info = (error as any).response.data;
        if (info.detail) {
          if (
            info.detail === 'Double spending attempt' ||
            info.detail.startsWith(
              'Malformed transaction: Every input of the transaction'
            ) ||
            info.detail.endsWith('it is already in the mempool') ||
            info.detail.startsWith('Ask timed out')
          ) {
            return 'retry';
          }
        }
        return undefined;
      }
      return undefined;
    }
  }

  public async getHeight(): Promise<number | undefined> {
    const url = `${this.getUrl()}/info`;
    try {
      return (await axios.get(url)).data.maxPeerHeight;
    } catch (error) {
      return undefined;
    }
  }

  public async getNetwork(): Promise<string | undefined> {
    const url = `${this.getUrl()}/info`;
    try {
      return (await axios.get(url)).data.network;
    } catch (error) {
      return undefined;
    }
  }

  public async getBlockByHeight(
    startHeightInclusive: number,
    endHeightInclusive?: number
  ): Promise<BlockHeader[]> {
    let url: string;
    if (!endHeightInclusive) {
      url = `${this.getUrl()}/blocks/chainSlice?fromHeight=${startHeightInclusive}&toHeight=${startHeightInclusive}`;
    } else {
      if (endHeightInclusive < startHeightInclusive) {
        return [];
      }

      url = `${this.getUrl()}/blocks/chainSlice?fromHeight=${
        startHeightInclusive - 1
      }&toHeight=${endHeightInclusive}`;
    }
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return [];
    }
  }
}
