import classNames from 'classnames';
import { ProgressBar } from '../ProgressBar';
import { Chains } from '#/constants/chains';
import { ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { Tokens } from '#/constants/tokens';
import { RoundedLabel } from '../Label/RoundedLabel';
export { ActiveBatches };

const dummyActiveBranches = {
  0: {
    name: 'rsSigUSD Bridge',
    token: Tokens[0],
    sourceNetwork: Chains[0],
    destNetwork: Chains[1],
    amountFunded: 900.0,
    goal: 2000,
    batchStartTime: '22:37 | 4 Sep 2024',
  },
  1: {
    name: 'rsSigUSD Bridge',
    token: Tokens[1],
    sourceNetwork: Chains[1],
    destNetwork: Chains[0],
    amountFunded: 2000.0,
    goal: 2000,
    batchStartTime: '21:47 | 4 Sep 2024',
  },
  2: {
    name: 'rsSigUSD Bridge',
    token: Tokens[2],
    sourceNetwork: Chains[0],
    destNetwork: Chains[1],
    amountFunded: 1900.0,
    goal: 2000,
    batchStartTime: '20:58 | 4 Sep 2024',
  },
};

interface ActiveBatchesProps {
  onBridgeViaThisBatchClicked: React.MouseEventHandler;
}

function ActiveBatches({ onBridgeViaThisBatchClicked }: ActiveBatchesProps) {
  return (
    <div className="p-4 items-center">
      {Object.keys(dummyActiveBranches).map((keyName) => {
        const data = dummyActiveBranches[keyName];
        const percentageFunded = (data.amountFunded / data.goal) * 100;
        return (
          <div
            id={keyName}
            className="grid grid-cols-1 lg:grid-cols-4 pb-4 text-gray-200 outline-teal-800 space-y-4 border-t border-slate-800/40"
          >
            {/** Bridge Name */}
            <div className="col-span-1 flex flex-col align-center justify-center">
              <div className="text-left py-3 flex flex-row items-center">
                <img src={data.token.icon} alt="" className="h-6 w-6 flex-shrink-0 rounded-full mr-2" />
                {data.token.name} Bridge
              </div>
              {/** Network path from */}
              <div className="flex flex-row items-center">
                <RoundedLabel
                  name={data.sourceNetwork.name}
                  icon={data.sourceNetwork.icon}
                  id={data.sourceNetwork.id}
                />
                <ArrowLongRightIcon className="w-5 h-5 mx-2" />
                <RoundedLabel name={data.destNetwork.name} icon={data.destNetwork.icon} id={data.destNetwork.id} />
              </div>
              {/** Network path end*/}
            </div>
            {/** Bridge Name end */}
            {/** Progress bar */}
            <div className="col-span-1 lg:col-span-2 content-center">
              <div className="text-left text-xs font-thin text-gray-400 py-2">Batch starting time: </div>
              <ProgressBar amount={data.amountFunded} goal={data.goal} />
              <div className="grid grid-cols-4 items-center">
                <div className="col-span-2 flex flex-col py-2">
                  <div className="text-left text-xs font-thin text-gray-400">Batch capacity filled: </div>
                  <div className="text-left text-xs font-thin text-teal-300">${data.amountFunded}</div>
                </div>
                <div className="col-span-1 text-teal-300 text-right px-2">{percentageFunded}%</div>
                <div className="px-2 col-span-1 ">
                  <div className="absolute -mt-8 ml-0.5 h-16 bg-teal-700/40 w-0.5" />
                  <div className="ml-2 text-gray-400 text-left text-xs font-thin">
                    <div>Batch transfer</div>
                    <div>threshold ($2000)</div>
                  </div>
                </div>
              </div>
            </div>
            {/** Progress bar end*/}
            {/** button */}
            <div className="col-span-1 flex flex-row justify-end lg:items-center">
              <button
                onClick={onBridgeViaThisBatchClicked}
                className="py-3 bg-gray-800 text-white text-xs px-5 rounded-lg drop-shadow-sm hover:drop-shadow-md hover:bg-gray-700 hover:text-slate-200 active:bg-gray-900 active:text-slate-300 active:shadow-inner shadow-2xl"
              >
                {' '}
                Bridge via this batch
              </button>
            </div>
            {/** button end */}
          </div>
        );
      })}
    </div>
  );
}
