import { Container, Tx } from '@rosen-port/db';
import { RosenChainToken } from '@rosen-bridge/tokens';
import { IRosenPortSDK } from './types/sdkTypes';
import { NotImplementedException } from '@rosen-port/errors';

export class RosenPortSDK implements IRosenPortSDK {
  /**
   * Bridge Token from sourceNetwork to destNetwork
   */
  bridge({
    sourceNetwork,
    destNetwork,
    amount,
    token,
    sourceAddress,
    destAddress,
    browserWallet,
  }: {
    sourceNetwork: string | number | symbol;
    destNetwork: string | number | symbol;
    amount: number;
    token: RosenChainToken;
    sourceAddress: string;
    destAddress: string;
    browserWallet?: boolean;
  }): Promise<any> {
    throw new NotImplementedException();
  }

  calculateFee({
    sourceNetwork,
    destNetwork,
    amount,
    token,
    sourceAddress,
    destAddress,
  }: {
    sourceNetwork: string | number | symbol;
    destNetwork: string | number | symbol;
    amount: number;
    token: RosenChainToken;
    sourceAddress: string;
    destAddress: string;
  }): number {
    throw new NotImplementedException();
  }

  refundTx(txId: string): Promise<any> {
    throw new NotImplementedException();
  }

  getContainers({
    limit,
    index,
  }: {
    limit: number;
    index: number;
  }): Container[] {
    throw new NotImplementedException();
  }

  getContainer(containerId: string): Container {
    throw new NotImplementedException();
  }

  getWalletTxs(walletAddresses: [string]): Tx[] {
    throw new NotImplementedException();
  }
}
