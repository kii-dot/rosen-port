import { publicProcedure, protectedProcedure, router } from '#/trpc/generic';

/**
 * Page Router:
 * Provides all the data for a website.
 */
export const pageRouter = router({
  ping: publicProcedure.query(async () => {
    return { message: 'pong: PageRouter working' };
  }),
  editAvailable: protectedProcedure.query(async ({ ctx }) => {
    const { req, res } = ctx;
  }),
});
