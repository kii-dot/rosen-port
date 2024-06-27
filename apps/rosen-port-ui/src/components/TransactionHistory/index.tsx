import { Chains } from '#/constants/chains';
import { ArrowLongRightIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { RoundedLabel } from '../Label';
import { Tokens } from '#/constants/tokens';
import { BlockSearch } from '../Icons';
import { TxStatus } from '@rosen-port/db';
import { useEffect, useState } from 'react';
import { getWindowDimensions } from '#/tools/windowDimensions';

export { TransactionHistory };

const dummyTransactionData = {
  0: {
    name: 'rsSigUSD Bridge',
    token: Tokens[0],
    sourceNetwork: Chains[0],
    destNetwork: Chains[1],
    amountFunded: 900.0,
    goal: 2000,
    batchStartTime: '22:37 | 4 Sep 2024',
    status: TxStatus.confirmed,
  },
  1: {
    name: 'rsSigUSD Bridge',
    token: Tokens[1],
    sourceNetwork: Chains[1],
    destNetwork: Chains[0],
    amountFunded: 1800.0,
    goal: 2000,
    batchStartTime: '21:47 | 4 Sep 2024',
    status: TxStatus.refund_completed,
  },
  2: {
    name: 'rsSigUSD Bridge',
    token: Tokens[1],
    sourceNetwork: Chains[0],
    destNetwork: Chains[1],
    amountFunded: 1900.0,
    goal: 2000,
    batchStartTime: '20:58 | 4 Sep 2024',
    status: TxStatus.sent,
  },
};

interface TransactionHistoryProps {
  onBlockSearchClick: React.MouseEventHandler;
}

const getTxStatus = (txStatus: TxStatus) => {
  var strokeColor;
  var bgColor;
  var statusMessage;
  switch (txStatus) {
    case TxStatus.unconfirmed:
    case TxStatus.confirmed:
      strokeColor = 'text-yellow-400';
      bgColor = 'bg-yellow-400';
      statusMessage = 'Onboarding Tx to container';
      break;
    case TxStatus.bridged:
      strokeColor = 'text-blue-400';
      bgColor = 'bg-blue-400';
      statusMessage = 'Container with Tx bridged';
      break;
    case TxStatus.sent:
      strokeColor = 'text-teal-400';
      bgColor = 'bg-teal-400';
      statusMessage = 'Transferred Successfully';
      break;
    case TxStatus.refunding:
      strokeColor = 'text-red-400';
      bgColor = 'bg-red-400';
      statusMessage = 'Refund being processed';
      break;
    case TxStatus.refund_completed:
      strokeColor = 'text-red-400';
      bgColor = 'bg-red-400';
      statusMessage = 'Refund Completed';
      break;
  }
  return (
    <div className="flex flex-row items-center contents-center space-x-2">
      <div className={classNames('w-2 h-2 rounded-full', bgColor)} />
      <div className={classNames(strokeColor, 'text-xs font-thin')}>{statusMessage}</div>
    </div>
  );
};

function TransactionHistory({ onBlockSearchClick }: TransactionHistoryProps) {
  return (
    <div>
      {/** Table Head
       * Unfortunately we have to use div so that we can design
       * the mobile screen better
       */}
      <div className="hidden lg:grid grid-cols-12 text-xs text-left text-gray-300 font-thin py-2 border-b border-slate-600/70">
        <div className="col-span-3">Token</div>
        <div className="col-span-2">Time & Date</div>
        <div className="col-span-2">Bridge Route</div>
        <div className="col-span-3">Status</div>
        <div className="col-span-2 justify-self-center">Actions</div>
      </div>
      {Object.keys(dummyTransactionData).map((keyName) => {
        const tx = dummyTransactionData[keyName];
        return (
          <div
            key={keyName}
            className="grid grid-cols-4 lg:grid-cols-12 text-white py-4 space-y-1 border-b border-slate-800/70"
          >
            {/** Token */}
            <div className="col-span-3 lg:col-span-3">
              <div className="flex flex-row items-center">
                <img src={tx.token.icon} alt="" className="h-8 w-8 flex-shrink-0 rounded-full mr-2" />
                <div className="pl-2">
                  <div className="text-sm">
                    {tx.amountFunded} {tx.token.name}
                  </div>
                  <div className="text-xs font-thin text-left text-gray-400">~ ${tx.amountFunded}</div>
                </div>
              </div>
            </div>
            {/** Token end */}
            {/** Date */}
            <div className="col-span-1 lg:col-span-2 flex flex-col items-end lg:items-start content-center">
              <div className="text-sm">2 Jul 2024</div>
              <div className="text-xs font-thin text-gray-400">22:35</div>
            </div>
            {/** Date end */}
            {/** Bridge Route */}
            <div className="col-span-4 lg:col-span-2 flex justify-left items-center">
              <RoundedLabel
                name={tx.sourceNetwork.name}
                icon={tx.sourceNetwork.icon}
                id={tx.sourceNetwork.id}
                iconOnly
              />
              <ArrowLongRightIcon className="w-4 h-4 mx-2" />
              <RoundedLabel name={tx.destNetwork.name} icon={tx.destNetwork.icon} id={tx.destNetwork.id} iconOnly />
            </div>
            {/** Bridge Route end */}
            {/** Status */}
            <div className="col-span-2 lg:col-span-3 flex justify-left items-center">{getTxStatus(tx.status)}</div>
            {/** Status End */}
            {/** Block Search Button*/}
            <div className="col-span-2 justify-end lg:col-span-2 flex lg:justify-center lg:items-center">
              <button
                onClick={() => {
                  console.log(keyName);
                }}
                className="bg-gray-700/30 w-7 h-7 rounded-full flex items-center justify-center  drop-shadow-sm hover:drop-shadow-md hover:bg-gray-700 hover:text-slate-200 active:bg-gray-900 active:text-slate-300 active:shadow-inner shadow-2x"
              >
                <BlockSearch className="w-4 h-4" />
              </button>
            </div>
            {/** Block Search Button End*/}
          </div>
        );
      })}
    </div>
  );
}
