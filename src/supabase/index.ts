import { DBClient } from '#/supabase/dbClient';
import dotenv from 'dotenv';
dotenv.config();

export const dbClient = new DBClient(
  process.env.PUBLIC_ENV__SUPABASE_URL !== undefined ? process.env.PUBLIC_ENV__SUPABASE_URL : '',
  process.env.PUBLIC_ENV__SUPABASE_KEY !== undefined ? process.env.PUBLIC_ENV__SUPABASE_KEY : '',
);
