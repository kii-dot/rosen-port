import { ActiveBatches } from '#/components/ActiveBatches';
import { AppPage } from '#/components/Page/AppPage';
import { trpc } from '#/trpc/client';
import { Container } from '@rosen-port/db';
import { useEffect, useState } from 'react';

export { Page };

function Page() {
  const [containers, setContainers] = useState<Container[]>([]);
  useEffect(() => {
    const createResp = async () => {
      const data = await trpc.main.containers.query({ index: 0, limit: 10 });
      console.log(data);
      if (data.containers) {
        setContainers(data.containers);
      }
    };

    createResp();
  }, []);

  return (
    <AppPage>
      <div className="lg:hidden text-2xl text-white justify-start flex mb-8">Active Batches</div>
      <ActiveBatches />
    </AppPage>
  );
}
