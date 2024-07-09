import { truncate } from '#/tools/generic/addressTruncate';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { grayButtonsBg, whiteTextsButtons } from '../../genericClassNames';
import { IWallet } from '#/components/Icons';
import { IChain, IToken } from '#/types/chains';

interface WalletButtonProps {
  walletAddress: string;
  token?: IToken;
  network?: IChain;
  tokenAmount?: number;
  walletDetails?: IWallet;
  onActiveWalletClicked: () => void;
}

export function ActiveWallet({
  walletAddress,
  token,
  network,
  tokenAmount,
  walletDetails,
  onActiveWalletClicked,
}: WalletButtonProps) {
  return (
    <div className="flex flex-row items-center space-x-2">
      {/** Value & Network */}
      <button
        onClick={onActiveWalletClicked}
        className={classNames(
          'flex flex-row space-x-1 h-9 rounded-lg items-center px-1 ',
          whiteTextsButtons,
          grayButtonsBg,
        )}
      >
        <div className="bg-gray-800 h-6 rounded-lg flex items-center mr-1">
          <div className="text-white font-thin text-sm px-2">
            <div>
              {tokenAmount} {token !== undefined ? token.name : ''}
            </div>
          </div>
        </div>
        {network !== undefined ? (
          <div className="text-white font-thin text-sm flex flex-row">
            <img src={network.icon} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
            <span className={'hidden truncate sm:ml-2 sm:block'}>{network.name}</span>
            <ChevronDownIcon className="text-white h-5 w-5" />
          </div>
        ) : (
          <div />
        )}
      </button>
      {/** Value & Network End */}
      {/** Wallet Address */}
      <button
        className={classNames(
          'hidden md:flex md:flex-row space-x-1 bg-gray-400/10 h-9 rounded-lg items-center px-2',
          grayButtonsBg,
        )}
      >
        {walletDetails !== undefined ? (
          <walletDetails.icon className="h-6 w-6 border rounded-full" />
        ) : (
          <div className="h-6 w-6 border rounded-full"></div>
        )}
        <div className={classNames('text-white font-thin text-sm px-1', whiteTextsButtons)}>
          {network?.id === 'ergo' ? truncate(walletAddress, 8, '...') : truncate(walletAddress, 12, '...')}
        </div>
      </button>
      {/** Wallet Address End */}
    </div>
  );
}
