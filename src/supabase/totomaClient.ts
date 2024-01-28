import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { DbConstants } from './dbConstants';

export class TotomaClient {
  supabaseClient: SupabaseClient;
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  fetchData = async (table: string, select: string, eqCol: string, eqTo: string) => {
    const { data, error } = await this.supabaseClient.from(table).select(select).eq(eqCol, eqTo);

    return { data, error };
  };

  insertData = async (table: string, value: object) => {
    const { data, error } = await this.supabaseClient.from(table).insert(value).select();

    return { data, error };
  };

  updateData = async (table: string, value: object, eqCol: string, eqTo: string) => {
    const { data, error } = await this.supabaseClient.from(table).update(value).eq(eqCol, eqTo).select();

    return { data, error };
  };

  checkHandle = async (handle: string) => {
    const { data, error } = await this.fetchData(
      DbConstants.handles.name,
      DbConstants.handles.columns.id.name,
      DbConstants.handles.columns.handle.name,
      handle,
    );

    return { data, error };
  };

  createHandle = async (handle: string, userId: string) => {
    const { data, error } = await this.insertData(DbConstants.handles.name, {
      [DbConstants.handles.columns.id.name]: userId,
      [DbConstants.handles.columns.handle.name]: handle.toLowerCase(),
    });

    return { data, error };
  };

  getHandle = async (userId: string) => {
    const { data, error } = await this.fetchData(
      DbConstants.handles.name,
      DbConstants.handles.columns.handle.name,
      DbConstants.handles.columns.id.name,
      userId,
    );

    return { data, error };
  };

  getHandleUser = async (handle: string) => {
    const { data, error } = await this.fetchData(
      DbConstants.handles.name,
      DbConstants.handles.columns.id.name,
      DbConstants.handles.columns.handle.name,
      handle,
    );

    return { data, error };
  };

  authenticateUserViaEmailPassword = async (email: string, password: string) => {
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });

    return { data, error };
  };

  signUp = async (email: string, password: string) => {
    const { data, error } = await this.supabaseClient.auth.signUp({
      email: email,
      password: password,
    });

    return { data, error };
  };

  signOut = async () => {
    const { error } = await this.supabaseClient.auth.signOut();

    return { error };
  };

  refreshToken = async (refreshToken: string, accessToken: string) => {
    const { data, error } = await this.supabaseClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    return { data, error };
  };
}
