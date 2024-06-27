import { QuestionMarkSolid } from '#/components/Icons';

const bridgeContent = {
  bridgeInfo2:
    '2. Once the batch reaches the $2000 threshold, it will be transferred and your transaction will get processed.',
  bridgeInfo1: '1. The funds you want to bridge will be added to a batch.',
  bridgeInfoBatchStatusTitle: 'Current batch status:',
  bridgeInfoBatchCapacityFilled: 'Batch capacity filled:',
  bridgeInfoAddingCaption: "You're adding:",
  averageWaitTimeTitle: 'Average wait time:',
  averageWaitTimeValue: '45m',
  averageWaitTimeCaption: '(Based on previous transaction on Rosen Port)',
  waitingToFill: 'Waiting to fill',
  bridgeInfoTitle: 'How does Port Bridge work?',
};

interface BridgeInfoProps {
  capacityFilledAmount: number;
  addingAmount: number;
  thresholdAmount: number;
}

export default function BridgeInfo({ capacityFilledAmount, addingAmount, thresholdAmount }: BridgeInfoProps) {
  return (
    <div className="flex flex-col">
      <div className="text-white font-thin text-sm flex flex-row">
        <QuestionMarkSolid className="h-5 w-5" />
        <div className="pl-2">{bridgeContent.bridgeInfoTitle}</div>
      </div>
      <div className="space-y-1 text-gray-500 font-thin text-xs text-left py-3">
        <div>{bridgeContent.bridgeInfo1}</div>
        <div>{bridgeContent.bridgeInfo2}</div>
      </div>

      {/** Current Batch */}
      <div className="flex flex-col my-7">
        <div className="text-white text-sm text-left">{bridgeContent.bridgeInfoBatchStatusTitle}</div>
        {/** Current Batch Internal */}
        <div className="flex flex-row text-gray-500 text-xs font-thin text-left justify-between">
          <div>
            <div className="flex flex-row items-center">
              <div className="w-2 h-2 mr-1 rounded-full bg-teal-300" />
              {bridgeContent.bridgeInfoBatchCapacityFilled}
            </div>
            <div>${capacityFilledAmount}</div>
          </div>
          <div>
            <div className="flex flex-row items-center">
              <div className="w-2 h-2 mr-1 rounded-full bg-teal-800" />
              {bridgeContent.bridgeInfoAddingCaption}
            </div>
            <div>${addingAmount}</div>
          </div>
        </div>
        {/** Current Batch Internal End*/}
        {/** Current Batch Threshold Visualizer*/}
        <div className="w-full h-2 rounded bg-petrol-slumber my-4">
          <div
            style={{ width: `${((capacityFilledAmount + addingAmount) / (thresholdAmount * 1.4)) * 100}%` }}
            className="bg-teal-800 h-2 rounded transition-width duration-500 ease-in-out"
          >
            <div
              style={{ width: `${(capacityFilledAmount / (capacityFilledAmount + addingAmount)) * 100}%` }}
              className="bg-teal-300 h-2 rounded transition-width duration-500 ease-in-out"
            ></div>
          </div>
        </div>
        {/** Current Batch Threshold Visualizer End*/}
        {/** Current Batch Thredhold Information*/}
        <div className="flex flex-row text-gray-500 text-xs font-thin text-left justify-between">
          <div>
            <div className="flex flex-row bg-yellow-800/10 rounded-full py-1 px-2 items-center text-yellow-500">
              <div className="w-2 h-2 mr-1 rounded-full bg-yellow-500" />
              {bridgeContent.waitingToFill}
            </div>
          </div>
          <div>
            <div className="absolute -mt-16 ml-0.5 h-24 bg-teal-700/40 w-0.5" />
            <div className="ml-2 text-gray-400 text-left text-xs font-thin">
              <div>Batch transfer</div>
              <div>threshold (${thresholdAmount})</div>
            </div>
          </div>
        </div>
        {/** Current Batch Thredhold Information End*/}
      </div>
      {/** Current Batch End*/}
      {/** Average wait time */}
      <div className="pt-6 text-white text-sm flex flex-row justify-between">
        <div>{bridgeContent.averageWaitTimeTitle}</div>
        <div>{bridgeContent.averageWaitTimeValue}</div>
      </div>
      <div className="space-y-1 text-gray-500 font-thin text-xs text-left">
        <div>{bridgeContent.averageWaitTimeCaption}</div>
      </div>
      {/** Average wait time End*/}
    </div>
  );
}
