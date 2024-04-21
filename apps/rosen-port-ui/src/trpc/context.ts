import * as trpcExpress from '@trpc/server/adapters/express';
import { getSession } from 'next-auth/react';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcExpress.CreateExpressContextOptions) {
  const { req, res } = opts;

  return {
    req,
    res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
