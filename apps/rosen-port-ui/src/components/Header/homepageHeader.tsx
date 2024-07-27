import logoIcon from '#/assets/logoNName.svg';
import { Link, RosenPortLink } from '../Link';

export default function HomePageHeader() {
  return (
    <header className="grid grid-cols-5 items-center mx-3 py-4">
      <div className="col-span-2 items-center text-lg flex">
        {/* Top Left Section */}
        <RosenPortLink className="ml-3 mr-2" href="/">
          <img src={logoIcon} alt="" className="h-6 w-18 flex-shrink-0 rounded-full" />
        </RosenPortLink>
      </div>
      <div className="col-span-3 flex justify-end space-x-2">
        {/* Top Right Section */}
        <RosenPortLink
          href="/bridge"
          className="rounded-lg px-6 py-1.5 bg-teal-800/40 text-teal-400 flex justify-content-center items-center hover:bg-teal-700/40 hover:text-teal-300 active:bg-teal-900/40 active:text-teal-500"
        >
          Launch App
        </RosenPortLink>
      </div>
    </header>
  );
}
