import { TransactionHistory } from '#/components/TransactionHistory';

import { AppPage } from '#/components/Page/AppPage';

export { Page };

function Page() {
  return (
    <AppPage>
      <TransactionHistory />
    </AppPage>
  );
}
