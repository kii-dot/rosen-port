const batchContent = {
  bridgeInfoBatchStatusTitle: 'Current batch status:',
  bridgeInfoBatchCapacityFilled: 'Batch capacity filled:',
  bridgeInfoAddingCaption: "You're adding:",
  waitingToFill: 'Waiting to fill',
};

interface BatchUIProps {
  capacityFilledAmount: number;
  addingAmount: number;
  thresholdAmount: number;
}

export const BatchUI = (props: BatchUIProps) => {
  return (
    <div className="flex flex-col my-7">
      <div className="text-white text-sm text-left pb-1.5">{batchContent.bridgeInfoBatchStatusTitle}</div>
      {/** Current Batch Internal */}
      <div className="flex flex-row text-gray-500 text-xs font-thin text-left justify-between">
        <div>
          <div className="flex flex-row items-center">
            <div className="w-2 h-2 mr-1 rounded-full bg-teal-300" />
            {batchContent.bridgeInfoBatchCapacityFilled}
          </div>
          <div>${props.capacityFilledAmount}</div>
        </div>
        <div>
          <div className="flex flex-row items-center">
            <div className="w-2 h-2 mr-1 rounded-full bg-teal-800" />
            {batchContent.bridgeInfoAddingCaption}
          </div>
          <div>${props.addingAmount}</div>
        </div>
      </div>
      {/** Current Batch Internal End*/}
      {/** Current Batch Threshold Visualizer*/}
      <div className="w-full h-2 rounded bg-gray-800 my-4">
        <div
          style={{
            width: `${((props.capacityFilledAmount + props.addingAmount) / (props.thresholdAmount * 1.4)) * 100}%`,
          }}
          className="bg-teal-800 h-2 rounded transition-width duration-500 ease-in-out"
        >
          <div
            style={{
              width: `${(props.capacityFilledAmount / (props.capacityFilledAmount + props.addingAmount)) * 100}%`,
            }}
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
            {batchContent.waitingToFill}
          </div>
        </div>
        <div>
          <div className="absolute -mt-16 ml-0.5 h-24 bg-teal-700/40 w-0.5" />
          <div className="ml-2 text-gray-400 text-left text-xs font-thin">
            <div>Batch transfer</div>
            <div>threshold (${props.thresholdAmount})</div>
          </div>
        </div>
      </div>
      {/** Current Batch Thredhold Information End*/}
    </div>
  );
};
