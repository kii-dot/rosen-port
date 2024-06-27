import { Bridge } from '#/components/Bridge';

import { AppPage } from '#/components/Page/AppPage';

export { Page };

function Page() {
  return (
    <>
      <AppPage>
        <div className="lg:hidden text-2xl text-white justify-start flex mb-8">Bridge</div>
        <Bridge />
      </AppPage>
    </>
  );
}
