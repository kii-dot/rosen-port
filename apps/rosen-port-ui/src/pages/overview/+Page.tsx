import { Header } from '#/components/Header';
import { ActiveBatches } from '#/components/ActiveBatches';
import { Bridge } from '#/components/Bridge';
import { TransactionHistory } from '#/components/TransactionHistory';

import React, { useState } from 'react';

export { Page };

function Page() {
  const [activeTab, setActiveTab] = useState('Tab1');

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
    <Header />
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-16 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <nav className="flex space-x-4">
              <button
                className={`px-4 py-2 ${activeTab === 'Tab1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => setActiveTab('Tab1')}
              >
                Bridge
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'Tab2' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => setActiveTab('Tab2')}
              >
                Transaction History
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'Tab3' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => setActiveTab('Tab3')}
              >
                Active Batches
              </button>
            </nav>
            <div className="mt-4">
              <ActiveComponent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
