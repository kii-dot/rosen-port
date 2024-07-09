import { Spinner } from '#/components/Icons';

interface WalletButtonProps {
  showActiveWallet: boolean;
  isLoading: boolean;
  children: React.ReactNode;
  onConnectWalletClicked: () => void;
}

export function WalletButton({ showActiveWallet, isLoading, children, onConnectWalletClicked }: WalletButtonProps) {
  const renderConnectWallet = () => {
    if (isLoading) {
      return (
        <button
          onClick={onConnectWalletClicked}
          className="rounded-lg px-6 py-1.5 bg-teal-800/40 text-teal-400 flex justify-content-center items-center hover:bg-teal-700/40 hover:text-teal-300 active:bg-teal-900/40 active:text-teal-500"
        >
          <Spinner className="w-6 h-6" />
        </button>
      );
    }

    return (
      <button
        onClick={onConnectWalletClicked}
        className="rounded-lg px-6 py-1.5 bg-teal-800/40 text-teal-400 flex justify-content-center items-center hover:bg-teal-700/40 hover:text-teal-300 active:bg-teal-900/40 active:text-teal-500"
      >
        Connect Wallet
      </button>
    );
  };

  const renderWallet = () => {
    if (isLoading || !showActiveWallet) {
      return renderConnectWallet();
    }

    /**
     * Render Active Wallet
     */
    return <div>{children}</div>;
  };

  return <div>{renderWallet()}</div>;
}
