import { useData } from '#/renderer/useData';
import type { Data } from './+data';
export { Page };
import { trpc } from '#/trpc/client';

function Page() {
  const { id } = useData<Data>();
  const { greeting } = trpc.demo.query();
  return (
    <>
      <h1>Welcome</h1>
      About
      <ul>
        <li>
          This is about page from <b>{id}</b>
        </li>
        <li>{greeting}</li>
      </ul>
    </>
  );
}
