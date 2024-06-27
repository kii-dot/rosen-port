import { productName } from './content';
import logoIcon from '#/assets/logoNName.svg';
import { WalletButton } from '../WalletButton';
export { Header };

function Header() {
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
