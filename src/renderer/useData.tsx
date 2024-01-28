// https://vike.dev/useData
export { useData };

import { usePageContext } from '#/context/usePageContext';

function useData<Data>() {
  const { data } = usePageContext();
  return data as Data;
}
