import { Chains } from '#/constants/chains';
import { Tokens } from '#/constants/tokens';
import { ChevronDoubleDownIcon } from '@heroicons/react/20/solid';
import BridgeCard from '../BridgeCard';
export { Bridge };

const BridgeConstants = {
  originChain: 'Origin Chain',
  destinationChain: 'Destination Chain',
};
const fees = 1.5;

function Bridge() {
  return (
    <div>
      <div className="flex-row"></div>
      <BridgeCard
        name={BridgeConstants.originChain}
        estimateAmount={0.02}
        balanceAmount={98.37}
        onMaxClick={() => console.log('max clicked')}
        chains={Chains}
        tokens={Tokens}
        selectedChain={Chains[0]}
        selectedToken={Tokens[2]}
        tokenAmount={null}
      ></BridgeCard>
      <div className="flex justify-center py-5">
        <div className="bg-teal-800/20 rounded-full w-9 h-9 flex items-center justify-center">
          <ChevronDoubleDownIcon className="h-6 w-6 flex-shrink-0 text-teal-300 " aria-hidden="true" />
        </div>
      </div>
      <BridgeCard
        name={BridgeConstants.destinationChain}
        estimateAmount={0.02}
        balanceAmount={98.37}
        onMaxClick={() => console.log('max clicked')}
        chains={Chains}
        tokens={Tokens}
        selectedChain={Chains[1]}
        selectedToken={Tokens[2]}
        tokenAmount={null}
      ></BridgeCard>
      <div className="text-gray-400 text-xs font-thin flex my-5">Fees: ~${fees}(1.00%)</div>
      <button className="bg-teal-500 w-full rounded-lg py-2">Initiate Bridge</button>
    </div>
  );
}
