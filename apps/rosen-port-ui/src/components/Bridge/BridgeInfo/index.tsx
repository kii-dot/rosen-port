import { BatchUI } from '#/components/Batch/BatchUI';
import { QuestionMarkSolid } from '#/components/Icons';

const bridgeContent = {
  bridgeInfo2:
    '2. Once the batch reaches the $2000 threshold, it will be transferred and your transaction will get processed.',
  bridgeInfo1: '1. The funds you want to bridge will be added to a batch.',
  bridgeInfoTitle: 'How does Port Bridge work?',
  averageWaitTimeTitle: 'Average wait time:',
  averageWaitTimeValue: '45m',
  averageWaitTimeCaption: '(Based on previous transaction on Rosen Port)',
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
      <BatchUI
        capacityFilledAmount={capacityFilledAmount}
        thresholdAmount={thresholdAmount}
        addingAmount={addingAmount}
      />
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
