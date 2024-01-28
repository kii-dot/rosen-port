import { publicProcedure, router } from '#/trpc/generic';

import { authRouter } from '#/trpc/routers/authRouter';
import { testRouter } from '#/trpc/routers/testRouter';
import { handleRouter } from '#/trpc/routers/handleRouter';
import { pageRouter } from '#/trpc/routers/pageRouter';

export const appRouter = router({
  demo: publicProcedure.query(async () => {
    return { greeting: 'hello, jelly' };
  }),
  auth: authRouter, // put procedures under "user" namespace
  test: testRouter, // put procedures under "post" namespace
  handle: handleRouter,
  page: pageRouter,
});

export type AppRouter = typeof appRouter;
