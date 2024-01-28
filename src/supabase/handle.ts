import { fetchData } from './db';
import { DbConstants } from './dbConstants';

export const checkHandle = async (handle: string) => {
  const { data, error } = await fetchData(
    DbConstants.handles.name,
    DbConstants.handles.columns.id.name,
    DbConstants.handles.columns.handle.name,
    handle,
  );

  return { data, error };
};

export const getHandle = async (userId: string) => {
  const { data, error } = await fetchData(
    DbConstants.handles.name,
    DbConstants.handles.columns.handle.name,
    DbConstants.handles.columns.id.name,
    userId,
  );

  return { data, error };
};
