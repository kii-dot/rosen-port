import { Bridge } from '#/components/Bridge';
import { ConfirmationModal, TokenModal } from '#/components/Modal';

import { AppPage } from '#/components/Page/AppPage';
import { Chains } from '#/constants/chains';
import { SigUSDToken, Tokens } from '#/constants/tokens';
import { IChain, IToken } from '#/types/chains';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export { Page };

function Page() {
  const { register, handleSubmit } = useForm();
  const [openTokenModal, setOpenTokenModal] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [originChain, setOriginChain] = useState<IChain | null>(null);
  const [destinationChain, setDestinationChain] = useState<IChain | null>(null);
  const [selectedToken, setSelectedToken] = useState(SigUSDToken);

  const confirmAndInitiateBridge = () => {
    console.log('confirm and initiate bridge');
    setOpenConfirmationModal(true);
  };

  const renderConfirmationModal = () => {
    return (
      <ConfirmationModal
        open={openConfirmationModal}
        setOpen={(open) => setOpenConfirmationModal(open)}
        onConfirmClicked={() => confirmAndInitiateBridge()}
        sourceChain={originChain}
        destChain={destinationChain}
        selectedToken={selectedToken}
      />
    );
  };

  const setToken = (token: IToken) => {
    setSelectedToken(token);
    setOpenTokenModal(false);
  };

  const renderTokenModal = () => {
    return (
      <TokenModal
        open={openTokenModal}
        setOpen={(open) => setOpenTokenModal(open)}
        onTokenClicked={(token) => setToken(token)}
        tokens={Tokens}
        selectedToken={selectedToken}
      />
    );
  };

  const setOriginChainClicked = (chain: IChain) => {
    if (destinationChain !== null && chain.id === destinationChain.id) {
      setDestinationChain(null);
    }

    setOriginChain(chain);
  };

  const setDestinationChainClicked = (chain: IChain) => {
    if (originChain !== null && chain.id === originChain.id) {
      setOriginChain(null);
    }

    setDestinationChain(chain);
  };

  const onSubmit = (d) => {
    console.log(JSON.stringify(d));
    confirmAndInitiateBridge();
  };

  return (
    <>
      <AppPage>
        <div className="lg:hidden text-2xl text-white justify-start flex mb-8">Bridge</div>
        <Bridge
          onSubmit={handleSubmit(onSubmit)}
          onTokenButtonClicked={() => setOpenTokenModal(true)}
          onOriginChainChanged={(chain) => setOriginChainClicked(chain)}
          onDestinationChainChanged={(chain) => setDestinationChainClicked(chain)}
          originChain={originChain}
          destinationChain={destinationChain}
          availableChains={Chains}
          onMaxClick={() => console.log('max')}
          tokenAmount={register('tokenAmount')}
          availableTokens={Tokens}
          selectedToken={selectedToken}
          destinationAddress={register('destinationAddress')}
        />
        {renderConfirmationModal()}
        {renderTokenModal()}
      </AppPage>
    </>
  );
}
