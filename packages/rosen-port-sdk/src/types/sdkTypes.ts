import { Container, Tx } from '@rosen-port/db';
import { RosenChainToken } from '@rosen-bridge/tokens';
import { UnsignedPsbtData, Networks } from '@rosen-port/chains';
import { UnsignedErgoTxProxy } from '@rosen-ui/wallet-api';

/**
 * Interface for functionalities of RosenPort
 */
export interface IRosenPortSDK {
  // Bridging Payments
  bridge: ({
    sourceNetwork,
    destNetwork,
    amount,
    token,
    sourceAddress,
    destAddress,
    browserWallet,
  }: {
    sourceNetwork: keyof typeof Networks;
    destNetwork: keyof typeof Networks;
    amount: number;
    token: RosenChainToken;
    sourceAddress: string;
    destAddress: string;
    browserWallet?: boolean;
  }) => Promise<string | UnsignedPsbtData | UnsignedErgoTxProxy>;

  calculateFee: ({
    sourceNetwork,
    destNetwork,
    amount,
    token,
    sourceAddress,
    destAddress,
  }: {
    sourceNetwork: keyof typeof Networks;
    destNetwork: keyof typeof Networks;
    amount: number;
    token: RosenChainToken;
    sourceAddress: string;
    destAddress: string;
  }) => number;

  // Refund
  refundTx: (
    txId: string
  ) => Promise<string | UnsignedPsbtData | UnsignedErgoTxProxy>;

  // Get Infos
  getContainers: ({
    limit,
    index,
  }: {
    limit: number;
    index: number;
  }) => Array<Container>;
  getContainer: (containerId: string) => Container;
  getWalletTxs: (walletAddresses: [string]) => Array<Tx>;
}
