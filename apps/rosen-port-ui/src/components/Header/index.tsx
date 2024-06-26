import { productName } from './content';
import logoIcon from '#/assets/logo.svg';
export { Header };

function Header() {
  return (
    <header className="flex items-center mx-4">
      <div className="flex items-center text-lg w-1/2 flex">
        {/* Top Left Section */}
        <div className="w-1/16 mr-2">
          <img src={logoIcon} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
        </div>
        <div className="text-lg w-15/16 justify">
          <span className="font-bold text-gray-200">{productName}</span>
        </div>
      </div>
      <div className="w-1/2 text-right">
        {/* Top Right Section */}
        <p className="font-bold text-white">Wallet Info Here</p>
      </div>
    </header>
  );
}
