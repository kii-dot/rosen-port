import { ProgressBar } from '../ProgressBar';
import { activeBatch } from './content';
export { ActiveBatches };

const dummyActiveBranches = {
  0: {
    BridgeName: "rsSigUSD Bridge",
    BridgePath: ["ADA", "ERG"],
    amountFunded: 900.0,
    goal: 2000,
    batchStartTime: "22:37 | 4 Sep 2024"
  },
  1: {
    BridgeName: "rsSigUSD Bridge",
    BridgePath: ["ADA", "ERG"],
    amountFunded: 1800.0,
    goal: 2000,
    batchStartTime: "21:47 | 4 Sep 2024"
  },
  2: {
    BridgeName: "rsSigUSD Bridge",
    BridgePath: ["ADA", "ERG"],
    amountFunded: 1900.0,
    goal: 2000,
    batchStartTime: "20:58 | 4 Sep 2024"
  },
}

function ActiveBatches() {
  return <div className="items-center">
      {Object.keys(dummyActiveBranches).map((keyName) => 
      {
        const data = dummyActiveBranches[keyName];
        return (<div className='flex py-4 text-gray-200'>
          <div className='w-1/4'>
              <p>{data.BridgeName}</p>
              <p>{data.BridgePath}</p>
          </div>
          <div className='w-2/4'>
            <p className='text-gray-200'>Batch starting time: {data.batchStartTime}</p>
            <ProgressBar amount={data.amountFunded} goal={data.goal} />
            <div className='flex flex-row justify-between'>
              <p className=''>Funded: <span className='text-teal-900'>${data.amountFunded} </span></p>
              <p className='text-gray-500'>Transfer Threshold: ${data.goal}</p>
            </div>
          </div>
          <div className='w-1/4'>
            <button className='p-2 hover:bg-teal-800 sm:rounded-full border shadow-2xl'> Bridge via this batch</button>
          </div>
        </div>);
      })
    }
    </div>
}
