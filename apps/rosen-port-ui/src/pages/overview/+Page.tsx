import { Header } from '#/components/Header';
import { ActiveBatches } from '#/components/ActiveBatches';
import { Bridge } from '#/components/Bridge';
import { TransactionHistory } from '#/components/TransactionHistory';

import React, { useState } from 'react';

export { Page };

function Page() {
  const [activeTab, setActiveTab] = useState('Tab2');

  let ActiveComponent: React.FC;
  switch (activeTab) {
    case 'Tab1':
      ActiveComponent = Bridge;
      break;
    case 'Tab2':
      ActiveComponent = TransactionHistory;
      break;
    case 'Tab3':
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
                className={`px-4 py-2 ${activeTab === 'Tab1' ? 'text-teal-400' : 'text-gray-400'}`}
                onClick={() => setActiveTab('Tab1')}
              >
                Bridge
              </p>
              <button
                className={`px-4 py-2 ${activeTab === 'Tab2' ? 'text-teal-400' : 'text-gray-400'}`}
                onClick={() => setActiveTab('Tab2')}
              >
                Transaction History
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'Tab3' ? 'text-teal-400' : 'text-gray-400'}`}
                onClick={() => setActiveTab('Tab3')}
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
