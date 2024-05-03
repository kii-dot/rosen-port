import { Network } from './Network';
import { DefaultRosenSDKConfig, RosenSDKConfig } from './RosenSDKConfig';
import { BridgeMinimumFee } from '@rosen-bridge/minimum-fee';
import { TransferFee, TransferResult } from './RosenSDKTypes';
import { Networks } from './constants';
import JsonBigInt from '@rosen-bridge/json-bigint';

/**
 * Set up rosen sdk
 * 1. set up the interface for
 * a. Get Fee
 * b. Transfer via wallet
 * c. Get txs history
 *
 * 2. copy paste code from apps/rosen
 * 3. test to see if the code can be used directly from rosen
 *
 */
class RosenSDK {
  private config: RosenSDKConfig;
  private network: Network;

  constructor(networkConfig: RosenSDKConfig = DefaultRosenSDKConfig) {
    this.config = networkConfig;
    this.network = new Network(networkConfig.NetworkConfig);
  }

  getConfig(): RosenSDKConfig {
    return this.config;
  }

  getNetwork(): Network {
    return this.network;
  }

  /**
   * fetches and return the minimum fee object for a specific token in network
   *
   * @param sourceNetwork
   * @param tokenId
   * @param height
   * @param explorerUrl
   * @param nextHeightInterval
   */
  async calculateTransferFee(
    sourceNetwork: keyof typeof Networks,
    tokenId: string,
    nextHeightInterval: number
  ): Promise<TransferFee> {
    const height = await this.network.GetHeight()[sourceNetwork]();
    const explorerUrl = this.network.GetExplorerUrl(sourceNetwork);

    if (!height) {
      return {
        tokenId,
        status: 'error',
        message: 'Cannot fetch height from the api endpoint',
      };
    }

    const minimumFee = new BridgeMinimumFee(
      explorerUrl,
      this.config.FeeConfigTokenId
    );

    try {
      const [fees, nextFees] = await Promise.all([
        minimumFee.getFee(tokenId, sourceNetwork, height),
        minimumFee.getFee(tokenId, sourceNetwork, height + nextHeightInterval),
      ]);

      return {
        status: 'success',
        tokenId,
        feeRatioDivisor: minimumFee.feeRatioDivisor,
        data: JsonBigInt.stringify({
          fees,
          nextFees,
        }),
      };
    } catch (error) {
      return {
        tokenId,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown Error',
      };
    }
  }

  /**
   * Transfers an asset from one blockchain to another, specifying source and destination wallets.
   */
  transferAsset(): TransferResult {
    // Implementation logic here, considering the source and destination wallets in the transfer
    return { transactionId: '123', status: 'pending' }; // Example return value
  }
}

export { RosenSDK };
