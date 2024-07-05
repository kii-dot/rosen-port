import { EipWalletApi } from '../ergo';
import { CipWalletApi } from '../cardano';

export interface ConnectorAPI {
  enable(): Promise<CipWalletApi>;
  isEnabled(): Promise<boolean>;
  experimental?: unknown;
}
