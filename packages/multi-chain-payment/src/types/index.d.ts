import { EipWalletApi } from '@rosen-ui/wallet-api';
import { CipWalletApi } from '@rosen-ui/wallet-api';

export interface ConnectorAPI {
  enable(): Promise<CipWalletApi>;
  isEnabled(): Promise<boolean>;
  experimental?: unknown;
}

/**
 * global type augmentation for nautilus wallet
 */
declare global {
  declare let ergoConnector: {
    nautilus: {
      connect: (params: { createErgoObject: boolean }) => Promise<boolean>;
      getContext: () => Promise<EipWalletApi>;
    };
  };

  declare let ergo: EipWalletApi;
  declare let cardano: { [key: string]: ConnectorAPI };
}
