import { Chains, NetworkChains } from '#/constants/chains';
import { IChain } from '#/types/chains';
import { useState } from 'react';
import Modal from '.';
import tick from '#/assets/genericIcon/tickCircle.svg';
import tickFull from '#/assets/genericIcon/tickFull.svg';
import {
  DottedBlock,
  EternlWallet,
  FlintWallet,
  IWallet,
  LaceWallet,
  NamiWallet,
  NautilusWallet,
  VesprWallet,
  XDefiWallet,
} from '../Icons';
import { H3, H4 } from '../Texts';
import { RoundedLabel, RoundedLabelButton } from '../Label';
import classNames from 'classnames';

const Wallets = {
  Bitcoin: {
    chain: NetworkChains.btc,
    wallets: [XDefiWallet],
  },
  Ergo: {
    chain: NetworkChains.ergo,
    wallets: [NautilusWallet],
  },
  Cardano: {
    chain: NetworkChains.cardano,
    wallets: [LaceWallet, EternlWallet, FlintWallet, NamiWallet, VesprWallet],
  },
};

interface WalletModalProps {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  onWalletClick: React.MouseEventHandler;
}

export const ConnectWalletModal = ({ open, setOpen, onWalletClick }: WalletModalProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const renderWallet = (wallet: IWallet) => {
    return (
      <div>
        <wallet.icon />
        <div>{wallet.name}</div>
        <div>{wallet.network}</div>
      </div>
    );
  };

  const renderNetworks = () => {
    const keys = Object.keys(Wallets);
    const networks: Array<IChain> = [];
    keys.forEach((key) => {
      networks.push(Wallets[key].chain);
    });

    return (
      <div className="flex flex-row space-x-4">
        <RoundedLabelButton
          onClick={() => setSelectedNetwork('')}
          name={'All Networks'}
          icon={selectedNetwork === '' ? tickFull : tick}
          id={''}
          iconClassName="w-6 h-6 text-white"
          className="text-sm"
          bgClassName={selectedNetwork === '' ? 'bg-teal-500/20' : ''}
        />
        {networks.map((network) => {
          return (
            <RoundedLabelButton
              key={network.name}
              onClick={() => setSelectedNetwork(network.name)}
              name={network.name}
              icon={network.icon}
              id={network.id}
              iconClassName="w-6 h-6"
              className={classNames('text-sm')}
              bgClassName={network.name === selectedNetwork ? 'bg-teal-500/20' : ''}
            />
          );
        })}
      </div>
    );
  };

  const renderWallets = () => {
    const keys = selectedNetwork !== '' ? [selectedNetwork] : Object.keys(Wallets);
    const wallets: Array<IWallet> = [];
    keys.forEach((key) => {
      const networkWallets: Array<IWallet> = Wallets[key].wallets;
      networkWallets.forEach((wallet) => {
        wallets.push(wallet);
      });
    });

    return (
      <div className="flex flex-row gap-4 flex-wrap">
        {wallets.map((wallet) => {
          return (
            <button
              key={wallet.name}
              onClick={onWalletClick}
              className="flex flex-col bg-gray-900/60 items-center w-20 rounded-lg px-2 py-2 hover:bg-gray-800/80 active:bg-gray-900"
            >
              <wallet.icon className="h-12 w-12 rounded-full px-2" />
              <H4>{wallet.name}</H4>
              <div className="text-gray-500 text-sm">{wallet.network}</div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Modal title={'Connect Wallet'} open={open} setOpen={setOpen}>
      <div>
        <div>
          <H3 className="sm:mt-8 sm:mb-2">Networks:</H3>
          <div>{renderNetworks()}</div>
        </div>
        <div>
          <H3 className="sm:mt-8 sm:mb-2">Wallets:</H3>
          <div>{renderWallets()}</div>
        </div>
      </div>
    </Modal>
  );
};
