import { truncate } from '#/tools/generic/addressTruncate';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { grayButtonsBg, whiteTextsButtons } from '../../genericClassNames';
import { IWallet, LogOut } from '#/components/Icons';
import { IChain, IToken } from '#/types/chains';
import { ChainSelector } from '../ChainSelector';
import { Chains } from '#/constants/chains';

interface WalletDetailsProps {
  walletAddress: string;
  token?: IToken;
  network?: IChain;
  tokenAmount?: number;
  walletDetails?: IWallet;
  onNetworkClicked: () => void;
  onLogOutClicked: () => void;
}

export function WalletDetailsBar({
  walletAddress,
  token,
  network,
  tokenAmount,
  walletDetails,
  onNetworkClicked,
  onLogOutClicked,
}: WalletDetailsProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      {/** Value & Network */}
      {/** Value & Network End */}
      {/** Wallet Address */}
      <div className={classNames('flex flex-row space-x-1 h-9 rounded-lg items-center px-2 space-x-3')}>
        {walletDetails !== undefined ? (
          <walletDetails.icon className="h-8 w-8 border rounded-full" />
        ) : (
          <div className="h-8 w-8 border rounded-full"></div>
        )}
        <div className="flex flex-col ml-3">
          <div className={classNames('text-left text-white tracking-wide text-md', whiteTextsButtons)}>
            {network?.id === 'ergo' ? truncate(walletAddress, 14, '...') : truncate(walletAddress, 12, '...')}
          </div>
          <div className={'text-left font-thin text-gray-400 text-sm'}>
            {tokenAmount} {token !== undefined ? token.name : ''}
          </div>
        </div>
      </div>
      <div className="flex flex-row space-x-4">
        <ChainSelector
          selectedChain={Chains[0]}
          chains={Chains}
          buttonClassName="bg-gray-600/40 hover:bg-gray-600/60 active:bg-gray-600/20"
        />
        <button onClick={onLogOutClicked}>
          <LogOut />
        </button>
      </div>
      {/** Wallet Address End */}
    </div>
  );
}
