import { Header } from '#/components/Header';
import { Link } from '../Link';

export { AppPage };

interface AppPageProps {
  children: React.ReactNode;
}

function AppPage({ children }: AppPageProps) {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-black opacity-90">
        <Header />
        <div className="mx-auto max-w-7xl lg:py-24 sm:px-6 sm:py-16 lg:px-8">
          <div className="relative isolate overflow-hidden px-6 lg:py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <nav id="navbar" className="flex space-x-4">
              <Link href="bridge" className="text-sm leading-6 text-white is-active:bg-teal-400">
                {/* {`px-4 py-2 rounded-lg hover:outline hover:bg-teal-800 ${activeTab === PageTabs.BridgeTab ? 'text-teal-400' : 'text-gray-400'}`} */}
                Bridge
              </Link>
              <Link href="txs" className="text-sm leading-6 text-white">
                Transaction History
              </Link>
              <Link href="batches" className="text-sm leading-6 text-white">
                Active Batches
              </Link>
            </nav>
            <div className="mt-4 flex-col-grow-1">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
