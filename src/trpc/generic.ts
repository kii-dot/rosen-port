import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { Context } from '#/trpc/context';
import { AUTH_ROUTER_CONSTANT } from './routers/constants';
import { dbClient } from './totomaClient';
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
