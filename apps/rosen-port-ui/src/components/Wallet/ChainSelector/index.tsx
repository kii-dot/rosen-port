import { grayButtonsBg, whiteTextsButtons } from '#/components/genericClassNames';
import { IChain } from '#/types/chains';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

interface ChainSelectorProps {
  selectedChain: IChain;
  chains: Array<IChain>;
  setChainChanged?: (chain: IChain) => void;
  buttonClassName?: string;
}

export function ChainSelector({ selectedChain, chains, setChainChanged, buttonClassName }: ChainSelectorProps) {
  return (
    <Listbox as="div" value={selectedChain} onChange={setChainChanged} className="flex-shrink-0">
      {({ open }) => (
        <>
          <Label className="sr-only">Select Chain</Label>
          <div className="relative">
            <ListboxButton
              className={classNames(
                buttonClassName,
                'flex flex-row space-x-1 h-9 rounded-lg items-center px-1 font-thin text-sm pl-3',
                whiteTextsButtons,
                grayButtonsBg,
              )}
            >
              <div className="flex flex-row">
                <div className="flex flex-row items-center">
                  {selectedChain.id === null ? (
                    <UserCircleIcon className="h-5 w-5 flex-shrink-0 text-gray-300 sm:-ml-1" aria-hidden="true" />
                  ) : (
                    <img src={selectedChain.icon} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                  )}

                  <span className={classNames('hidden truncate sm:ml-2 sm:block')}>
                    {selectedChain.id === null ? 'Select Network' : selectedChain.name}
                  </span>
                </div>
                <div className="">
                  <ChevronDownIcon className="h-7 w-7 pl-2 flex-shrink-0 text-gray-300 sm:-ml-1" aria-hidden="true" />
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
                      <UserCircleIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
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
  );
}
