import { TotomaClient } from '#/supabase/totomaClient';
import dotenv from 'dotenv';
dotenv.config();

export const totomaClient = new TotomaClient(
  process.env.PUBLIC_ENV__SUPABASE_URL !== undefined ? process.env.PUBLIC_ENV__SUPABASE_URL : '',
  process.env.PUBLIC_ENV__SUPABASE_KEY !== undefined ? process.env.PUBLIC_ENV__SUPABASE_KEY : '',
);
