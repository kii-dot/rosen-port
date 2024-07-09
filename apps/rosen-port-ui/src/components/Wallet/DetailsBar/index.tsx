import { truncate } from '#/tools/generic/addressTruncate';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { grayButtonsBg, whiteTextsButtons } from '../../genericClassNames';
import { IWallet, LogOut } from '#/components/Icons';
import { IChain, IToken } from '#/types/chains';

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
        <button
          onClick={onNetworkClicked}
          className={classNames(
            'flex flex-row space-x-1 h-9 rounded-lg items-center px-1 ',
            whiteTextsButtons,
            grayButtonsBg,
          )}
        >
          {network !== undefined ? (
            <div className="pl-2 text-white font-thin text-sm flex flex-row">
              <img src={network.icon} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
              <span className={'hidden truncate sm:ml-2 sm:block'}>{network.name}</span>
              <ChevronDownIcon className="text-white h-5 w-5" />
            </div>
          ) : (
            <div />
          )}
        </button>
        <button onClick={onLogOutClicked}>
          <LogOut />
        </button>
      </div>
      {/** Wallet Address End */}
    </div>
  );
}
