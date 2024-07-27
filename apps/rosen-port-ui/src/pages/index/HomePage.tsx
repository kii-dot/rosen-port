import light from '#/assets/light.png';
import HomePageHeader from '#/components/Header/homepageHeader';
import { RosenPortLink } from '#/components/Link';
import classNames from 'classnames';
import { description, tagline } from './content';

export default function HomePage() {
  const renderCTA = () => {
    return (
      <div className="flex flex-col m-auto space-y-6 justify-center">
        <div className="flex flex-col space-y-3">
          <div className={classNames('text-white text-5xl text-center')}>{tagline}</div>
          <div className="text-gray-300 font-thin text-center">{description}</div>
        </div>
        <div className="flex justify-center">
          <RosenPortLink
            href="/bridge"
            className="rounded-lg px-6 py-1.5 bg-teal-800/40 text-teal-400 flex justify-content-center items-center hover:bg-teal-700/40 hover:text-teal-300 active:bg-teal-900/40 active:text-teal-500"
          >
            Launch App
          </RosenPortLink>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-dark-sea opacity-90 pb-10">
        <img src={light} className="-z-10 h-full absolute opacity-20 scale-x-[-1]" />
        <HomePageHeader />
        <div className="mx-auto lg:py-24 sm:px-6 lg:px-8">{renderCTA()}</div>
      </div>
    </>
  );
}
