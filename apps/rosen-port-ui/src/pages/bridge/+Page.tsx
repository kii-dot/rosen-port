import { Bridge } from '#/components/Bridge';
import Modal from '#/components/Modal';

import { AppPage } from '#/components/Page/AppPage';
import { useState } from 'react';

export { Page };

function Page() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppPage>
        <div className="lg:hidden text-2xl text-white justify-start flex mb-8">Bridge</div>
        <Bridge onTokenButtonClicked={() => setOpen(true)} />
        <Modal title={'Select Token'} open={open} setOpen={(open) => setOpen(open)}>
          Hello
        </Modal>
      </AppPage>
    </>
  );
}
