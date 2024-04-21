import { publicProcedure, router } from '#/trpc/generic';

import { testRouter } from '#/trpc/routers/testRouter';
import { mainRouter } from '#/trpc/routers/mainRouter';

export const appRouter = router({
  demo: publicProcedure.query(async () => {
    return { greeting: 'hello, jelly' };
  }),
  test: testRouter, // put procedures under "post" namespace
  main: mainRouter,
});

export type AppRouter = typeof appRouter;
