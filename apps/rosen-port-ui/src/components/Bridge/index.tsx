import { Chains } from '#/constants/chains';
import { Tokens } from '#/constants/tokens';
import { ChevronDoubleDownIcon } from '@heroicons/react/20/solid';
import BridgeInfo from './BridgeInfo';
import BridgeCard from '../BridgeCard';
import BridgeAddressCard from '../BridgeCard/BridgeAddressCard';
import { IChain, IToken } from '#/types/chains';
import { FieldValues, UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';
export { Bridge };

const BridgeConstants = {
  originChain: 'Origin Chain',
  destinationChain: 'Destination Chain',
};
const fees = 1.5;

interface BridgeProps {
  onTokenButtonClicked?: React.MouseEventHandler;
  onOriginChainChanged: (chain: IChain) => void;
  onDestinationChainChanged: (chain: IChain) => void;
  onMaxClick: React.MouseEventHandler;
  onSubmit: React.FormEventHandler;
  originChain: IChain | null;
  destinationChain: IChain | null;
  availableChains: IChain[];
  tokenAmount: UseFormRegisterReturn<string>;
  tokenBalance?: bigint;
  availableTokens: IToken[];
  selectedToken: IToken;
  destinationAddress: UseFormRegisterReturn<string>;
}

function Bridge({
  onTokenButtonClicked,
  onOriginChainChanged,
  onDestinationChainChanged,
  onMaxClick,
  onSubmit,
  tokenBalance,
  originChain,
  destinationChain,
  availableChains,
  availableTokens,
  selectedToken,
  tokenAmount,
  destinationAddress,
}: BridgeProps) {
  return (
    <form onSubmit={onSubmit} className="lg:grid lg:grid-cols-2">
      <div className="flex-row lg:col-span-1 lg:pr-10">
        <BridgeCard
          name={BridgeConstants.originChain}
          // estimateAmount={0.02}
          balanceAmount={tokenBalance}
          onMaxClick={onMaxClick}
          chains={availableChains}
          tokens={availableTokens}
          selectedChain={originChain}
          selectedToken={selectedToken}
          onTokenButtonClicked={onTokenButtonClicked}
          tokenAmount={tokenAmount}
          setChainChanged={onOriginChainChanged}
        ></BridgeCard>
        <div className="flex justify-center py-5">
          <div className="bg-teal-800/20 rounded-full w-9 h-9 flex items-center justify-center">
            <ChevronDoubleDownIcon className="h-6 w-6 flex-shrink-0 text-teal-300 " aria-hidden="true" />
          </div>
        </div>
        <BridgeAddressCard
          name={BridgeConstants.destinationChain}
          chains={availableChains.filter((chain) => originChain !== null && chain.name !== originChain.name)}
          selectedChain={destinationChain}
          address={destinationAddress}
          setChainChanged={onDestinationChainChanged}
        ></BridgeAddressCard>
        <div className="text-gray-400 text-xs font-thin flex my-5">
          Fees: ~ {tokenAmount !== undefined ? `${Number(tokenAmount) * 0.01} ` : '... '}
          {selectedToken.name} (1.00%)
        </div>
        <button
          type="submit"
          className="bg-teal-500 w-full rounded-lg py-2 hover:bg-teal-400 hover:text-gray-900 active:bg-teal-600 active:text-gray-800"
        >
          Initiate Bridge
        </button>
      </div>
      <div className="mt-12 lg:mt-3 lg:col-span-1 lg:pr-10 lg:pl-24 lg:pt-10">
        <BridgeInfo capacityFilledAmount={100} addingAmount={20} thresholdAmount={200} />
      </div>
    </form>
  );
}
