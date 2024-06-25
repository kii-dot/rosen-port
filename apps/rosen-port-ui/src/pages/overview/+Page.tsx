import { Header } from '#/components/Header';
import { ActiveBatches } from '#/components/ActiveBatches';
import { Bridge } from '#/components/Bridge';
import { TransactionHistory } from '#/components/TransactionHistory';

import React, { useState } from 'react';

export { Page };

enum PageTabs {
  BridgeTab,
  TxHistoryTab,
  ActiveBatchesTab,
}

function Page() {
  const [activeTab, setActiveTab] = useState(PageTabs.BridgeTab);

  let ActiveComponent: React.FC;
  switch (activeTab) {
    case PageTabs.BridgeTab:
      ActiveComponent = Bridge;
      break;
    case PageTabs.TxHistoryTab:
      ActiveComponent = TransactionHistory;
      break;
    case PageTabs.ActiveBatchesTab:
      ActiveComponent = ActiveBatches;
      break;
    default:
      ActiveComponent = Bridge;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-black opacity-90">
        <Header />
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-16 lg:px-8">
          <div className="relative isolate overflow-hidden px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <nav className="flex space-x-4">
              <p
                className={`px-4 py-2 ${activeTab === PageTabs.BridgeTab ? 'text-teal-400' : 'text-gray-400'}`}
                onClick={() => setActiveTab(PageTabs.BridgeTab)}
              >
                Bridge
              </p>
              <button
                className={`px-4 py-2 ${activeTab === PageTabs.TxHistoryTab ? 'text-teal-400' : 'text-gray-400'}`}
                onClick={() => setActiveTab(PageTabs.TxHistoryTab)}
              >
                Transaction History
              </button>
              <button
                className={`px-4 py-2 ${activeTab === PageTabs.ActiveBatchesTab ? 'text-teal-400' : 'text-gray-400'}`}
                onClick={() => setActiveTab(PageTabs.ActiveBatchesTab)}
              >
                Active Batches
              </button>
            </nav>
            <div className="mt-4 flex-col-grow-1">
              <ActiveComponent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
