import { publicProcedure, router } from '#/trpc/generic';

export const testRouter = router({
  ping: publicProcedure.query(async () => {
    return { message: 'pong' };
  }),
});
