import { supabase } from './client';

export const fetchData = async (table: string, select: string, eqCol: string, eqTo: string) => {
  const { data, error } = await supabase.from(table).select(select).eq(eqCol, eqTo);

  return { data, error };
};
