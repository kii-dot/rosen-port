import { useData } from '#/renderer/useData';
import type { Data } from './+data';
import { Link } from '#/components/Link';
import { AuthContainer } from '#/context/authContext';
import { trpc } from '#/trpc/client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { AUTH_ROUTER_CONSTANT } from '#/trpc/routers/constants';

export { Page };

function Page() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const { authData } = AuthContainer.useContainer();
  const { id } = useData<Data>();

  useEffect(() => {
    async function fetchSession() {
      console.log('fetching session');
      const resp = await trpc.auth.getSession.mutate();
      console.log(resp);
      setAuthenticated(resp?.authenticated);
    }

    const cookies = Cookies.get();
    console.log(cookies);

    // setUserId(Cookies.get(AUTH_ROUTER_CONSTANT.USER_ID));
    console.log(userId);

    fetchSession();
  }, [userId]);

  const getHref = () => {
    return `/@${id}/about`;
  };

  const onSignOutClicked = async () => {
    const handleResp = await trpc.auth.signOut.mutate();
    if (handleResp.error === '') {
      window.location.href = '/';
    }
  };

  return (
    <>
      <h1>Welcome</h1>
      <b>{id}</b> profile
      <ul>
        <li>{authenticated ? 'authenticated' : 'not authenticated'}</li>
        <li>
          <Link className="navitem" href={getHref()}>
            About {authData?.token}
          </Link>
        </li>
        <li>
          <button
            className="bg-black text-white text-base py-2 px-4 rounded hover:bg-gray-700"
            type="button"
            onClick={onSignOutClicked}
          >
            SignOut
          </button>
        </li>
      </ul>
    </>
  );
}
