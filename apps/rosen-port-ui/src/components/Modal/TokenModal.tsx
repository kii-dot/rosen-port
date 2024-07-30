import { IToken } from '#/types/chains';
import { useEffect, useState } from 'react';
import Modal from './ModalBase';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

interface TokenModalProps {
  open: boolean;
  setOpen: (boolean: boolean) => void;
  onTokenClicked: (token: IToken) => void;
  tokens: Array<IToken>;
  selectedToken: IToken;
}

export const TokenModal = ({ open, setOpen, selectedToken, tokens, onTokenClicked }: TokenModalProps) => {
  const [tokensDisplay, setTokensDisplay] = useState(tokens);
  const [searchValue, setSearchValue] = useState('');

  return (
    <Modal title={'Select token'} open={open} setOpen={setOpen}>
      <div className="flex flex-col">
        {/* Search bar */}
        <div className="relative mt-7 mb-6 flex items-center w-full">
          <div className="absolute inset-y-0 left-2 flex py-1.5 pr-1.5 items-center">
            <MagnifyingGlassIcon className="h-5 w-5 ml-2 text-gray-500" />
          </div>
          <input
            id="search"
            name="search"
            type="text"
            className="bg-petrol-slumber text-white font-thin tracking-wide pl-12 block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
            placeholder="Search tokens by name..."
            value={searchValue}
            onChange={(e) => {
              if (e.target.value === null || e.target.value === '') {
                setTokensDisplay(tokens);
              } else {
                const tokensFiltered = tokens.filter((token) =>
                  token.name.toLocaleLowerCase().includes(e.target.value),
                );
                setTokensDisplay(tokensFiltered);
              }
              setSearchValue(e.target.value);
            }}
          />
        </div>
        <div className="text-white flex flex-col text-left items-start space-y-4">
          {tokensDisplay.map((token) => {
            return (
              <button
                key={token.id}
                onClick={() => onTokenClicked(token)}
                className={classNames(
                  'flex flex-row tracking-wide text-md items-center',
                  selectedToken.id === token.id ? 'font-medium' : 'font-thin',
                )}
              >
                <img src={token.icon} alt="" className="h-7 w-7 flex-shrink-0 rounded-full mr-3" />
                {token.name}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
