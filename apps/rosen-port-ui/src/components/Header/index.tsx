import { useState } from 'react';
import logoIcon from '#/assets/logoNName.svg';
import { WalletButton } from '../WalletButton';
export { Header };
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { grayButtonsBg, whiteTextsButtons } from '../genericClassNames';
import { RosenPortLink } from '../Link';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <DialogPanel
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-y-0 right-0 z-10 w-full bg-black/70"
        >
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
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-5 py-6 flex flex-col text-gray-500">
                  <RosenPortLink href="bridge">
                    {/* {`px-4 py-2 rounded-lg hover:outline hover:bg-teal-800 ${activeTab === PageTabs.BridgeTab ? 'text-teal-400' : 'text-gray-400'}`} */}
                    Bridge
                  </RosenPortLink>
                  <RosenPortLink href="txs">Transaction History</RosenPortLink>
                  <RosenPortLink href="batches">Active Batches</RosenPortLink>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    );
  };

  return (
    <header className="grid grid-cols-4 items-center mx-4 py-4">
      <div className="col-span-2 items-center text-lg flex">
        {/* Top Left Section */}
        <div className="mr-2">
          <img src={logoIcon} alt="" className="h-6 w-18 flex-shrink-0 rounded-full" />
        </div>
      </div>
      <div className="col-span-2 flex justify-end space-x-2">
        {/* Top Right Section */}
        <WalletButton />
        {renderMobileView()}
        {renderDialog()}
      </div>
    </header>
  );
}
