import { IWallet } from '#/components/Icons';
import { Networks, getChains } from '#/constants/chains';
import { ErgToken, SigUSDToken } from '#/constants/tokens';
import { CardanoWalletType, CipWalletBase } from '#/tools/wallet/cardano/CardanoWallet';
import { decodeWasmAddress, decodeWasmValue } from '#/tools/wallet/cardano/cardanoDecoder';
import { EipWalletBase, ErgoWalletType } from '#/tools/wallet/ergo/ErgoWallet';
import { IChain, IToken } from '#/types/chains';
import { AssetEntry } from '@rosen-ui/wallet-api';
import { useState } from 'react';
import { createContainer } from 'unstated-next';

interface WalletData {
  token: string;
  // Add other relevant auth data here
}

interface TokenBalance {
  token: IToken;
  amount: number;
  decimals: number;
}

/**
 * The goal of the wallet is to:
 * 1. Keep track of wallet addresses
 * 2. Keep track of wallet balances
 * 3. Keep track of the context
 * @param initialState
 * @returns
 */
export function useWallet() {
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string>('');
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [walletNetwork, setWalletNetwork] = useState<IChain | null>(null);
  const [walletDetails, setWalletDetails] = useState<IWallet | null>(null);

  const getTokenAmount = (): number => {
    if (tokenBalance === null) {
      return 0;
    }

    return tokenBalance?.amount / Math.pow(10, tokenBalance?.decimals);
  };

  const connectWallet = async (wallet: IWallet, browserWallet: EipWalletBase | CipWalletBase) => {
    setWalletDetails(wallet);
    switch (wallet.walletType) {
      case ErgoWalletType.Nautilus:
      case ErgoWalletType.SafeW:
        await browserWallet.connectWallet();
        setCurrentWalletAddress(await browserWallet.getChangeAddress());
        const ergAmount = await browserWallet.getBalance('');
        const ergToken = {
          token: ErgToken,
          amount: Number(ergAmount),
          decimals: 9,
        };

        setTokenBalance(ergToken);
        setWalletNetwork(getChains(Networks.Ergo));
        break;
      case CardanoWalletType.Eternl:
      case CardanoWalletType.Flint:
      case CardanoWalletType.Vespr:
      case CardanoWalletType.Nami:
      case CardanoWalletType.Lace:
        await browserWallet.connectWallet();
        setCurrentWalletAddress(await browserWallet.getChangeAddress());
        const tokenBalances: AssetEntry = (await browserWallet.getBalance('')) as AssetEntry;
        const adaToken: TokenBalance = {
          token: SigUSDToken,
          amount: Number(tokenBalances.quantity),
          decimals: 6,
        };
        setTokenBalance(adaToken);

        setWalletNetwork(getChains(Networks.Cardano));
        break;
    }
  };

  const disconnectWallet = async (browserWallet: EipWalletBase | CipWalletBase) => {};

  const signAndSubmit = async (callback: () => void) => {};

  return {
    currentWalletAddress,
    tokenBalance,
    walletNetwork,
    walletDetails,
    connectWallet,
    disconnectWallet,
    getTokenAmount,
  };
}

export const WalletContainer = createContainer(useWallet);
