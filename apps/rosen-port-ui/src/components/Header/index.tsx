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

interface HeaderProps {
  mobileMenuOpen: boolean;
}

function Header({ mobileMenuOpen }: HeaderProps) {
  return (
    <header className="grid grid-cols-4 items-center mx-4 py-4">
      <div className="col-span-2 items-center text-lg flex">
        {/* Top Left Section */}
        <div className="mr-2">
          <img src={logoIcon} alt="" className="h-6 w-18 flex-shrink-0 rounded-full" />
        </div>
      </div>
      <div className="col-span-2 flex justify-end">
        {/* Top Right Section */}
        <WalletButton />
      </div>
    </header>
  );
}
