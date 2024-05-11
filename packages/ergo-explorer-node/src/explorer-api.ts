import axios from 'axios';
import {
  BlockHeadersResponse,
  Box,
  NetworkStats,
} from './types/explorer.types';
import { ErgoExplorerUrl, ErgoNetwork, IErgoExplorerUrl } from './constant';

export class ErgoExplorerAPI {
  private readonly baseUrl: IErgoExplorerUrl;
  network: ErgoNetwork;

  constructor(
    baseUrl: IErgoExplorerUrl = ErgoExplorerUrl.getDefault(),
    network: ErgoNetwork = ErgoNetwork.mainnet
  ) {
    this.baseUrl = baseUrl;
    this.network = network;
    axios.defaults.headers.common['Accept-Encoding'] = 'gzip';
  }

  getUrl(): string {
    return this.baseUrl[this.network];
  }

  public async getUnspentBoxesByAddress(
    address: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<Array<Box>> {
    const url = `${this.getUrl()}/api/v1/boxes/unspent/byAddress/${address}?limit=${limit}&offset=${offset}`;
    try {
      const result = (await axios.get(url)).data;
      return result.items as Array<Box>;
    } catch (error) {
      throw new Error('Error Getting Boxes');
    }
  }

  public async submitTransaction(transaction: any): Promise<{ id: string }> {
    const url = `${this.getUrl()}/api/v1/mempool/transactions/submit`;
    try {
      return (await axios.post(url, transaction)).data;
    } catch (error) {
      throw new Error('Error submitting transactions');
    }
  }

  public async getBlockHeaders(): Promise<BlockHeadersResponse> {
    const url = `${this.getUrl()}/api/v1/blocks/headers`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Error getting Headers');
    }
  }

  public async getNetworkState(): Promise<NetworkStats> {
    const url = `${this.getUrl()}/api/v1/networkState`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Error getting Network State');
    }
  }
}
