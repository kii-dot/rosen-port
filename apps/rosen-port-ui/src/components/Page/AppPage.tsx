import { Header } from '#/components/Header';
import { RosenPortLink } from '../Link';
import light from '#/assets/light.png';
import PageNotification from '../Notification';
import { useState } from 'react';

export { AppPage };

interface AppPageProps {
  children: React.ReactNode;
}

function AppPage({ children }: AppPageProps) {
  const [showNotification, setShowNotification] = useState<boolean>(false);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-dark-sea opacity-90 pb-10">
        <img src={light} className="-z-10 h-full absolute opacity-20 scale-x-[-1]" />
        <Header />
        <div className="mx-auto max-w-7xl lg:py-24 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden px-6 lg:py-24 text-center sm:rounded-3xl sm:px-16">
            <nav id="navbar" className="hidden lg:flex text-gray-500/90 space-x-8 tracking-wider text-lg leading-6">
              <RosenPortLink href="bridge">
                {/* {`px-4 py-2 rounded-lg hover:outline hover:bg-teal-800 ${activeTab === PageTabs.BridgeTab ? 'text-teal-400' : 'text-gray-400'}`} */}
                Bridge
              </RosenPortLink>
              <RosenPortLink href="txs">Transaction History</RosenPortLink>
              <RosenPortLink href="batches">Active Batches</RosenPortLink>
            </nav>
            <PageNotification
              show={showNotification}
              cancelClicked={() => setShowNotification(false)}
              title={'Bridge Transfer Initiated'}
            >
              Initiated 0.00125 rsBTC ($87.53) bridge from Ergo to Bitcoin
            </PageNotification>
            <div className="mt-6 flex-col-grow-1">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
