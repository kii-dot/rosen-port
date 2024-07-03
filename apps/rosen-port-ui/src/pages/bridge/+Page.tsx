import { Bridge } from '#/components/Bridge';
import Modal from '#/components/Modal';
import { ConnectWalletModal } from '#/components/Modal/WalletModal';

import { AppPage } from '#/components/Page/AppPage';
import { useState } from 'react';

export { Page };

enum BridgePageModal {
  TOKEN,
  CONNECT_WALLET,
}

function Page() {
  const [openTokenModal, setOpenTokenModal] = useState(false);

  return (
    <>
      <AppPage>
        <div className="lg:hidden text-2xl text-white justify-start flex mb-8">Bridge</div>
        <Bridge onTokenButtonClicked={() => setOpenTokenModal(true)} />
      </AppPage>
    </>
  );
}
