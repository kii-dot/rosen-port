import { Chains } from '#/constants/chains';
import { ArrowLongRightIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

export { TransactionHistory };

const dummyTransactionData = {
  0: {
    Token: "ADA",
    sourceNetwork: Chains[0],
    destNetwork: Chains[1],
    DateTime: "2 Jul 2024 22:35",
    Status: "Waiting to Fill",
    Actions: undefined
  },
  1: {
    Token: "ERG",
    sourceNetwork: Chains[1],
    destNetwork: Chains[0],
    DateTime: "2 Jul 2024 22:35",
    Status: "Completed",
    Actions: undefined
  },
  2: {
    Token: "ADA",
    sourceNetwork: Chains[0],
    destNetwork: Chains[1],
    DateTime: "2 Jul 2024 22:35",
    Status: "Completed",
    Actions: undefined
  },
}

interface RoundedLabelProps {
  name: string;
  icon: string;
  id: string;
}
const RoundedLabel = ({ name, icon, id }: RoundedLabelProps) => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-row items-center bg-indigo-200/20 py-1 rounded-full px-2">
        <img src={icon} alt="" className="h-4 w-4 flex-shrink-0 rounded-full" />

        <span className={classNames('hidden truncate text-xs sm:ml-2 sm:block')}>
          {id === null ? 'Select Network' : name}
        </span>
      </div>
    </div>
  );
};

function TransactionHistory() {
  return<table className="w-full table-auto text-gray-300">
            <thead>
              <tr>
                <th>Token</th>
                <th>Bridge Route</th>
                <th>Time & Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(dummyTransactionData).map((keyName) => {
                return <>
                  <tr className="text-white hover:outline odd:bg-indigo-950 even:bg-indigo-900 opacity-60">
                    <td>
                      {dummyTransactionData[keyName].Token}
                    </td>
                    <td className='flex justify-center'>
                      <RoundedLabel
                        name={dummyTransactionData[keyName].sourceNetwork.name}
                        icon={dummyTransactionData[keyName].sourceNetwork.icon}
                        id={dummyTransactionData[keyName].sourceNetwork.id}
                      />
                      <ArrowLongRightIcon className="w-5 h-5 mx-2" />
                      <RoundedLabel name={dummyTransactionData[keyName].destNetwork.name} icon={dummyTransactionData[keyName].destNetwork.icon} id={dummyTransactionData[keyName].destNetwork.id} />
                    </td>
                    <td>
                      {dummyTransactionData[keyName].DateTime}
                    </td>
                    <td>
                      {dummyTransactionData[keyName].Status}
                    </td>
                    <td>
                      {dummyTransactionData[keyName].Actions}
                    </td>

                  </tr>
                
                </>;
              }
              )}
            </tbody>
          </table>
}
