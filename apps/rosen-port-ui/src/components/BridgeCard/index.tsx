import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { IChain, IToken } from '#/types/chains';
import classNames from 'classnames';
import { UseFormRegisterReturn } from 'react-hook-form';

interface BridgeCardProps {
  name: string;
  // estimateAmount: number;
  tokenAmount: UseFormRegisterReturn<string>;
  balanceAmount?: bigint;
  setChainChanged: (chain: IChain) => void;
  onTokenButtonClicked?: React.MouseEventHandler;
  onMaxClick?: React.MouseEventHandler;
  chains: Array<IChain>;
  tokens: Array<IToken>;
  selectedChain: IChain | null;
  selectedToken: IToken;
}

export default function BridgeCard({
  name,
  // estimateAmount,
  tokenAmount,
  onMaxClick,
  balanceAmount,
  selectedChain,
  selectedToken,
  chains,
  onTokenButtonClicked,
  setChainChanged,
}: BridgeCardProps) {
  return (
    <div className="shadow-sm">
      <div className="flex flex-row">
        <label htmlFor="title" className="sr-only">
          {name}
        </label>
        <div className="block w-full border-0 pt-2.5 text-xs font-medium text-white text-left">{name}</div>
        <Listbox as="div" value={selectedChain} onChange={setChainChanged} className="flex-shrink-0">
          {({ open }) => (
            <>
              <Label className="sr-only">Select Chain</Label>
              <div className="relative">
                <ListboxButton className="relative inline-flex items-center whitespace-nowrap font-thin rounded-full bg-indigo-300/10 px-2 py-1 text-sm text-white hover:bg-indigo-300/20 sm:px-3">
                  <div className="flex flex-row">
                    <div className="flex flex-row items-center">
                      {selectedChain === null || selectedChain.id === null ? (
                        <GlobeAltIcon className="h-5 w-5 flex-shrink-0 text-gray-300 sm:-ml-1" aria-hidden="true" />
                      ) : (
                        <img src={selectedChain.icon} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                      )}

                      <span className={classNames('hidden truncate sm:ml-2 sm:block')}>
                        {selectedChain === null || selectedChain.id === null ? 'Select Network' : selectedChain.name}
                      </span>
                    </div>
                    <div className="sm:ml-4">
                      <ChevronDownIcon
                        className="h-7 w-7 pl-2 flex-shrink-0 text-gray-300 sm:-ml-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </ListboxButton>

                <ListboxOptions
                  transition
                  className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-petrol-slumber py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                >
                  {chains.map((chain) => (
                    <ListboxOption
                      key={chain.name}
                      className={({ focus }) =>
                        classNames(
                          focus ? 'bg-corbeau' : '',
                          !focus ? 'bg-petrol-slumber' : '',
                          'relative cursor-default select-none px-3 py-2',
                        )
                      }
                      value={chain}
                    >
                      <div className="flex items-center">
                        {chain.icon ? (
                          <img src={chain.icon} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                        ) : (
                          <GlobeAltIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        )}

                        <span className="ml-3 block truncate font-thin text-white">{chain.name}</span>
                      </div>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </>
          )}
        </Listbox>
      </div>
      <div className="bg-indigo-300/10 rounded-lg pb-2 my-2">
        <div className="flex items-center justify-between space-x-3 px-2 pt-2 sm:px-3">
          <div className="relative">
            <button
              type="button"
              onClick={onTokenButtonClicked}
              className="relative inline-flex items-center whitespace-nowrap font-thin rounded-full bg-black/70 px-2 py-1 text-sm text-white hover:bg-black/90 sm:px-3"
            >
              {selectedToken.id === null ? (
                <GlobeAltIcon className="h-5 w-5 flex-shrink-0 text-gray-300 sm:-ml-1" aria-hidden="true" />
              ) : (
                <img src={selectedToken.icon} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
              )}

              <span className={classNames('hidden truncate sm:ml-2 sm:block')}>
                {selectedToken.name === null ? 'Select Token' : selectedToken.name}
              </span>
              <ChevronDownIcon className="h-7 w-7 pl-2 flex-shrink-0 text-gray-300 sm:-ml-1" aria-hidden="true" />
            </button>
          </div>
          <div className="flex">
            <span className="text-xs text-gray-500 group-hover:text-gray-600">
              Bal: {balanceAmount !== undefined ? Number(balanceAmount) : '...'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-3 px-2 py-2 sm:px-3">
          <input
            type="number"
            className="block w-full py-1.5 border-none border-transparent text-xl focus:outline-none focus:ring-0 bg-transparent text-gray-100 shadow-sm placeholder:text-gray-400 sm:leading-6"
            min={0}
            {...tokenAmount}
            // value={tokenAmount}
            placeholder="Enter Amount..."
            // onChange={(event) => onTokenAmountChanged(Number(event.target.value))}
          />
          <div className="flex-shrink-0">
            <button
              onClick={onMaxClick}
              className="inline-flex items-center rounded-md bg-mallard/30 px-2 py-1.5 text-xs text-ice-climber shadow-sm hover:bg-mallard/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Max
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-3 px-2 sm:px-3">
          {/* <div className="flex">
              <span className="text-xs text-gray-500 group-hover:text-gray-600">~ {estimateAmount}</span>
            </div> */}
        </div>
      </div>
    </div>
  );
}
