import { fetchData } from './db';
import { DbConstants } from './dbConstants';

export const checkHandle = async (handle: string) => {
  const { data, error } = await fetchData(
    DbConstants.users.name,
    DbConstants.users.columns.id.name,
    DbConstants.users.columns.handle.name,
    handle,
  );

  return { data, error };
};

export const getHandle = async (userId: string) => {
  const { data, error } = await fetchData(
    DbConstants.users.name,
    DbConstants.users.columns.handle.name,
    DbConstants.users.columns.id.name,
    userId,
  );

  return { data, error };
};
