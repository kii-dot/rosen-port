import { useState } from 'react';
import logoIcon from '#/assets/logoNName.svg';
import { WalletButton } from '../Wallet/Button';
export { Header };
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { grayButtonsBg, whiteTextsButtons } from '../genericClassNames';
import { RosenPortLink } from '../Link';
import { ConnectWalletModal } from '../Wallet/Modal/WalletModal';
import { getWallet } from '#/tools/wallet';
import { IWallet } from '../Icons';
import { useWallet } from '#/context/walletContext';
import { ActiveWallet } from '../Wallet/ActiveWallet';
import { WalletDetailsBar } from '../Wallet/DetailsBar';

function Header() {
  const { currentWalletAddress, walletNetwork, tokenBalance, walletDetails, connectWallet, getTokenAmount } =
    useWallet();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);

  const renderMobileView = () => {
    return (
      <div className="flex lg:hidden">
        <button
          type="button"
          className={classNames(
            'inline-flex items-center justify-center rounded-lg p-2 h-9 w-9',
            grayButtonsBg,
            whiteTextsButtons,
          )}
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    );
  };

  const renderDialog = () => {
    return (
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full bg-black/70">
          <div className="bg-petrol-slumber px-6 py-6">
            <div className="flex items-center justify-end">
              <button
                type="button"
                className={classNames('-m-2.5 rounded-md p-2.5', whiteTextsButtons)}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6">
                <div className="space-y-5 pb-6 flex flex-col text-gray-500">
                  <RosenPortLink href="bridge">
                    {/* {`px-4 py-2 rounded-lg hover:outline hover:bg-teal-800 ${activeTab === PageTabs.BridgeTab ? 'text-teal-400' : 'text-gray-400'}`} */}
                    Bridge
                  </RosenPortLink>
                  <RosenPortLink href="txs">Transaction History</RosenPortLink>
                  <RosenPortLink href="batches">Active Batches</RosenPortLink>
                </div>
                <div className="w-full bg-gray-700 h-0.5 mb-5" />
                <div className="mb-4">
                  <WalletButton
                    onConnectWalletClicked={() => {
                      setShowConnectWalletModal(true);
                    }}
                    showActiveWallet={currentWalletAddress !== '' && currentWalletAddress.length >= 0}
                    isLoading={false}
                  >
                    <WalletDetailsBar
                      walletAddress={currentWalletAddress}
                      tokenAmount={getTokenAmount()}
                      token={tokenBalance?.token}
                      network={walletNetwork ? walletNetwork : undefined}
                      walletDetails={walletDetails ? walletDetails : undefined}
                      onNetworkClicked={() => {
                        console.log('activeWalletClicked');
                      }}
                      onLogOutClicked={() => {
                        console.log('log out clicked');
                      }}
                    />
                  </WalletButton>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    );
  };

  const onWalletClick = async (wallet: IWallet) => {
    const browserWallet = getWallet(wallet.walletType);
    connectWallet(wallet, browserWallet);
    setShowConnectWalletModal(false);
  };

  const renderModal = () => {
    return (
      <ConnectWalletModal
        open={showConnectWalletModal}
        setOpen={(open) => setShowConnectWalletModal(open)}
        onWalletClick={async (e, wallet) => {
          onWalletClick(wallet);
        }}
      />
    );
  };

  return (
    <header className="grid grid-cols-5 items-center mx-3 py-4">
      <div className="col-span-2 items-center text-lg flex">
        {/* Top Left Section */}
        <RosenPortLink href="/" className="ml-3 mr-2">
          <img src={logoIcon} alt="" className="h-6 w-18 flex-shrink-0 rounded-full" />
        </RosenPortLink>
      </div>
      <div className="col-span-3 flex justify-end space-x-2">
        {/* Top Right Section */}
        <WalletButton
          onConnectWalletClicked={() => {
            setShowConnectWalletModal(true);
          }}
          showActiveWallet={currentWalletAddress !== '' && currentWalletAddress.length >= 0}
          isLoading={false}
        >
          <ActiveWallet
            walletAddress={currentWalletAddress}
            tokenAmount={getTokenAmount()}
            token={tokenBalance?.token}
            network={walletNetwork ? walletNetwork : undefined}
            walletDetails={walletDetails ? walletDetails : undefined}
            onActiveWalletClicked={() => {
              console.log('activeWalletClicked');
            }}
          />
        </WalletButton>
        {renderMobileView()}
        {renderDialog()}
        {renderModal()}
      </div>
    </header>
  );
}
