import { productName } from './content';
export { Header };

function Header() {
  return <header className="flex p-4 items-center bg-gray-300">
      <div className="text-lg w-1/2 justify">
        {/* Top Left Section */}
        <p className="font-bold">Logo {productName}</p>
      </div>
      <div className="w-1/2 text-right">
        {/* Top Right Section */}
        <p className="font-bold">Wallet Info Here</p>
      </div>
    </header>
}
