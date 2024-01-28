import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '#/trpc/generic';
import { AUTH_ROUTER_CONSTANT } from './constants';
import { totomaClient } from '../totomaClient';

/**
 * Auth & Cookies with Trpc:
 * https://github.com/trpc/trpc/discussions/4226
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
 * https://www.reddit.com/r/nextjs/comments/t78qlq/authenticating_users_without_nextauth/
 */
export const authRouter = router({
  ping: publicProcedure.query(async ({ ctx }) => {
    const { req, res } = ctx;
    console.log(req.cookies);
    // If accessToken expired, this will fail.
    // if it does not, we will get user back
    let resp = await totomaClient.supabaseClient.auth.getUser(req.cookies.access_token);
    console.log(resp);
    return { greeting: 'pong: Auth is working' };
  }),
  accessCheck: protectedProcedure.query(async ({ ctx }) => {
    const { req, res } = ctx;
    console.log(req.cookies);
    return { greeting: 'accessCheck: Authed' };
  }),
  signOut: publicProcedure.mutation(async ({ input, ctx }) => {
    const { error } = await totomaClient.signOut();

    const { res } = ctx;
    if (error === null) {
      res.clearCookie(AUTH_ROUTER_CONSTANT.REFRESH_TOKEN);
      res.clearCookie(AUTH_ROUTER_CONSTANT.ACCESS_TOKEN);
      res.clearCookie(AUTH_ROUTER_CONSTANT.USER_ID);

      return { error: '' };
    } else {
      return { error: error };
    }
  }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const loginResp = await totomaClient.authenticateUserViaEmailPassword(input.email, input.password);

      const session = loginResp?.data?.session;

      let refreshToken, accessToken;
      if (session !== null) {
        refreshToken = session.refresh_token;
        accessToken = session.access_token;

        const { res } = ctx;
        res.cookie(AUTH_ROUTER_CONSTANT.REFRESH_TOKEN, refreshToken, { httpOnly: true });
        res.cookie(AUTH_ROUTER_CONSTANT.ACCESS_TOKEN, accessToken, { httpOnly: true });
        res.cookie(AUTH_ROUTER_CONSTANT.USER_ID, session.user.id);
      }

      let handleResp;
      if (session?.user?.id) {
        handleResp = await totomaClient.getHandle(session?.user?.id);

        if (handleResp.data !== null && handleResp.data.length > 0) {
          return {
            // @ts-expect-error
            id: handleResp?.data[0].handle,
          };
        }
      }
    }),
  createHandle: publicProcedure
    .input(
      z.object({
        handle: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // 1. Sign Up with Email and Password
      // Q: What if user signed up, but handle is not available?
      const signUpResp = await totomaClient.signUp(input.email, input.password);

      // 2. Retrieve Access token and user token
      const session = signUpResp?.data?.session;
      let refreshToken, accessToken;
      if (session !== null) {
        refreshToken = session.refresh_token;
        accessToken = session.access_token;

        const { res } = ctx;
        res.cookie(AUTH_ROUTER_CONSTANT.REFRESH_TOKEN, refreshToken, { httpOnly: true });
        res.cookie(AUTH_ROUTER_CONSTANT.ACCESS_TOKEN, accessToken, { httpOnly: true });
        res.cookie(AUTH_ROUTER_CONSTANT.USER_ID, session.user.id);
      }

      // 3. Create handle.
      if (signUpResp.data !== null && signUpResp.data.user !== null) {
        const handleResp = await totomaClient.createHandle(input.handle, signUpResp.data.user.id);
        return handleResp;
      } else {
        const errorMessage = signUpResp?.error?.message;
        throw Error('failed during signup ' + errorMessage);
      }
      // return { input };
    }),
  // GetSession is equivalent to check authenticated
  getSession: publicProcedure.mutation(async ({ ctx }) => {
    const { req, res } = ctx;
    const { refresh_token, access_token } = req.cookies;

    // 1. Check with supabase if access_token is valid
    // a. if valid, return authenticated
    // b. if not valid
    //    i. check refresh token to see if refresh token is same
    //      1. If refresh token is same, refresh session and auth
    //        and then add to res cookie
    //      2. if refresh token is not, then we revoke.
    if (access_token) {
      // Check with supabase
      let checkAccessTokenValidResponse;

      // Not Valid
      if (!checkAccessTokenValidResponse) {
        if (refresh_token) {
          // Check refresh token to see if true
          const refreshTokenResp = await totomaClient.refreshToken(refresh_token, access_token);

          const session = refreshTokenResp?.data?.session;

          let refreshToken, accessToken;
          if (session !== null) {
            refreshToken = session.refresh_token;
            accessToken = session.access_token;

            const { res } = ctx;
            res.cookie(AUTH_ROUTER_CONSTANT.REFRESH_TOKEN, refreshToken, { httpOnly: true });
            res.cookie(AUTH_ROUTER_CONSTANT.ACCESS_TOKEN, accessToken, { httpOnly: true });
            res.cookie(AUTH_ROUTER_CONSTANT.USER_ID, session.user.id);
          } else {
            // revoke token
            res.clearCookie(AUTH_ROUTER_CONSTANT.ACCESS_TOKEN);
            res.clearCookie(AUTH_ROUTER_CONSTANT.REFRESH_TOKEN);
            res.clearCookie(AUTH_ROUTER_CONSTANT.USER_ID);

            res.end();
          }
        } else {
          // revoke token
          res.clearCookie(AUTH_ROUTER_CONSTANT.ACCESS_TOKEN);
          res.clearCookie(AUTH_ROUTER_CONSTANT.REFRESH_TOKEN);
          res.clearCookie(AUTH_ROUTER_CONSTANT.USER_ID);

          res.end();
        }
      }

      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
    };
  }),
});
