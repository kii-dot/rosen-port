import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { Context } from '#/trpc/context';
import { AUTH_ROUTER_CONSTANT } from './routers/constants';
import { totomaClient } from './totomaClient';
import { OpenApiMeta } from 'trpc-openapi';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 *
 * // For OPEN API IMPL
 * https://www.npmjs.com/package/trpc-openapi
 */
const t = initTRPC.context<Context>().meta<OpenApiMeta>().create({
  transformer: superjson,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(async (opts) => {
  const cookies = opts.ctx.req.cookies;
  const userId = cookies[AUTH_ROUTER_CONSTANT.USER_ID];
  const accessToken = cookies[AUTH_ROUTER_CONSTANT.ACCESS_TOKEN];
  const refreshToken = cookies[AUTH_ROUTER_CONSTANT.REFRESH_TOKEN];

  // 1. Check if we have UserId, AccessToken and/or RefreshToken
  if (userId && accessToken && refreshToken) {
    if (accessToken) {
      // Check with supabase
      let checkAccessTokenValidResponse;

      // Not Valid
      if (!checkAccessTokenValidResponse) {
        if (refreshToken) {
          // Check refresh token to see if true
          const refreshTokenResp = await totomaClient.refreshToken(refreshToken, accessToken);

          const session = refreshTokenResp?.data?.session;

          let refreshTokenFresh, accessTokenFresh;
          if (session !== null) {
            refreshTokenFresh = session.refresh_token;
            accessTokenFresh = session.access_token;

            const { res } = opts.ctx;
            res.cookie(AUTH_ROUTER_CONSTANT.REFRESH_TOKEN, refreshToken, { httpOnly: true });
            res.cookie(AUTH_ROUTER_CONSTANT.ACCESS_TOKEN, accessToken, { httpOnly: true });
            res.cookie(AUTH_ROUTER_CONSTANT.USER_ID, session.user.id);
          } else {
            // revoke token
            opts.ctx.res.clearCookie(AUTH_ROUTER_CONSTANT.ACCESS_TOKEN);
            opts.ctx.res.clearCookie(AUTH_ROUTER_CONSTANT.REFRESH_TOKEN);
            opts.ctx.res.clearCookie(AUTH_ROUTER_CONSTANT.USER_ID);

            opts.ctx.res.end();
          }
        } else {
          // revoke token
          opts.ctx.res.clearCookie(AUTH_ROUTER_CONSTANT.ACCESS_TOKEN);
          opts.ctx.res.clearCookie(AUTH_ROUTER_CONSTANT.REFRESH_TOKEN);
          opts.ctx.res.clearCookie(AUTH_ROUTER_CONSTANT.USER_ID);

          opts.ctx.res.end();
        }
      }

      return opts.next({
        ctx: {
          // Infers the `session` as non-nullable
          session: opts.ctx.req.cookies,
        },
      });
    }
  }

  throw new TRPCError({
    code: 'UNAUTHORIZED',
  });
});
