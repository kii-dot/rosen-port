import { Chains } from '#/constants/chains';
import { Tokens } from '#/constants/tokens';
import { truncate } from '#/tools/generic/addressTruncate';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { useState } from 'react';
import { grayButtonsBg, whiteTextsButtons } from '../genericClassNames';

export function WalletButton() {
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState(Chains[0]);
  const [token, setToken] = useState(Tokens[0]);
  const [tokenAmount, setTokenAmount] = useState(3189.54);
  const renderConnectWallet = () => {
    return (
      <button className="rounded-lg px-6 py-1.5 bg-teal-800/40 text-teal-400 flex justify-content-center items-center hover:bg-teal-700/40 hover:text-teal-300 active:bg-teal-900/40 active:text-teal-500">
        Connect Wallet
      </button>
    );
  };

  const renderActiveWallet = () => {
    return (
      <div className="flex flex-row items-center space-x-2">
        {/** Value & Network */}
        <button
          className={classNames(
            'flex flex-row space-x-1 h-9 rounded-lg items-center px-1 ',
            whiteTextsButtons,
            grayButtonsBg,
          )}
        >
          <div className="bg-gray-800 h-6 rounded-lg flex items-center mr-1">
            <div className="text-white font-thin text-sm px-2">
              <div>
                {tokenAmount} {token.name}
              </div>
            </div>
          </div>
          <div className="text-white font-thin text-sm flex flex-row">
            <img src={network.icon} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
            <span className={'hidden truncate sm:ml-2 sm:block'}>{network.name}</span>
          </div>
          <ChevronDownIcon className="text-white h-5 w-5" />
        </button>
        {/** Value & Network End */}
        {/** Wallet Address */}
        <div className="hidden md:flex md:flex-row space-x-1 bg-gray-400/10 h-9 rounded-lg items-center px-1">
          <div className="text-white font-thin text-sm px-2">{truncate(walletAddress, 8, '...')}</div>
          {/* <ChevronDownIcon className="text-white h-5 w-5" /> */}
        </div>
        {/** Wallet Address End */}
      </div>
    );
  };

  const renderWallet = () => {
    if (walletAddress === undefined || walletAddress === null || walletAddress.length <= 0) {
      return renderConnectWallet();
    }

    return renderActiveWallet();
  };

  return <div>{renderWallet()}</div>;
}
