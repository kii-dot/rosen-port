import { TransactionHistory } from '#/components/TransactionHistory';

import { AppPage } from '#/components/Page/AppPage';

export { Page };

function Page() {
  return (
    <AppPage>
      <div className="lg:hidden text-2xl text-white justify-start flex mb-8">Transaction History</div>
      <TransactionHistory />
    </AppPage>
  );
}
