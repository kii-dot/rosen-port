import { Bridge } from '#/components/Bridge';
import { ConfirmationModal, TokenModal } from '#/components/Modal';

import { AppPage } from '#/components/Page/AppPage';
import { Tokens } from '#/constants/tokens';
import { useState } from 'react';

export { Page };

function Page() {
  const [openTokenModal, setOpenTokenModal] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const confirmAndInitiateBridge = () => {
    console.log('confirm and initiate bridge');
    setOpenConfirmationModal(false);
  };

  const renderConfirmationModal = () => {
    return (
      <ConfirmationModal
        open={openConfirmationModal}
        setOpen={(open) => setOpenConfirmationModal(open)}
        onConfirmClicked={() => confirmAndInitiateBridge()}
      />
    );
  };

  const setToken = () => {
    console.log('set token');
    setOpenTokenModal(false);
  };

  const renderTokenModal = () => {
    return (
      <TokenModal
        open={openTokenModal}
        setOpen={(open) => setOpenTokenModal(open)}
        onTokenClicked={() => setToken()}
        tokens={Tokens}
      />
    );
  };

  return (
    <>
      <AppPage>
        <div className="lg:hidden text-2xl text-white justify-start flex mb-8">Bridge</div>
        <Bridge
          onTokenButtonClicked={() => setOpenTokenModal(true)}
          onInitiateBridgeButtonClicked={() => setOpenConfirmationModal(true)}
        />
        {renderConfirmationModal()}
        {renderTokenModal()}
      </AppPage>
    </>
  );
}
