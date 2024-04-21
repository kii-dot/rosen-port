/**
 * Authentication
 *
 * Read regarding Access_token vs Refresh_token:
 * https://github.com/supabase/supabase/issues/11014#issuecomment-1359305465
 *
 * The access_token: is a short-lived token used to authenticate a user's request
 *                    when accessing a resource
 * The refresh_token: is a token to get access_token without authenticating
 *
 * Mechanics of authentication:
 * After authentication of a user, they will receive a session object.
 * We will store the access_token, refresh_token and user_id in localStorage
 *
 * ## Checking for authenticated user:
 *    We check
 *
 *
 * // Session object
 * data: {
 *  session: {
 *    access_token: string
 *    expires_at: number
 *    expires_in: number
 *    refresh_token: string
 *    token_type: string
 *    user: {
 *      app_metadata: object stating provider
 *      aud: "authenticated" or not
 *      confirmed_at: datetime
 *      created_at: datetime
 *      email: string
 *      email_confirmed_at: datetime
 *      id: string
 *      identities: object
 *      last_sign_in_at: datetime
 *      phone: string
 *      role: "authenticated"
 *      updated_at: datetime
 *    }
 *  }
 * }
 */
import { supabase } from './client';

export const authenticateUserViaOTP = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
  });

  return { data, error };
};

export const authenticateUserViaIDToken = async (provider: string, token: string) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: provider,
    token: token,
  });

  return { data, error };
};

export const authenticateUserViaEmailPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  return { data, error };
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  return { data, error };
};
