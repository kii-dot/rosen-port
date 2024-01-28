import { z } from 'zod';
import { publicProcedure, router } from '#/trpc/generic';
import { redis } from '#/tools/redis';

import dotenv from 'dotenv';
import { totomaClient } from '../totomaClient';
dotenv.config();

export const handleRouter = router({
  ping: publicProcedure.query(async (opts) => {
    return { greeting: 'pong: Handle is working' };
  }),
  /**
   * ### Reserve Handle ###
   *
   * Reserves the handle for X amount of time. This is to
   * prevent race conditions when user tries to sign up
   * with the same handle. A handle is reserved when user
   * click the "Choose Handle" button.
   */
  reserveHandle: publicProcedure
    .input(
      z.object({
        handle: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;

      const threeMinutes = 180;

      const isReserved = await redis.get(input.handle);

      // 1. Save the value to redis
      if (isReserved === false || isReserved === '') {
        const reserveHandleData = await redis.setex(input.handle, threeMinutes, input.email);

        if (reserveHandleData) {
          const result = {
            message: `${input.handle} reserved for ${threeMinutes} seconds`,
          };
          return result;
        }
      }

      throw Error(`${input.handle} has been reserved`);
    }),
  /**
   * ### Get Handle's User ###
   *
   * Get the UserId of the handle
   */
  getHandleUser: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/handle/{handle}/userId' } })
    .input(
      z.object({
        handle: z.string(),
      }),
    )
    .output(
      z.object({
        userId: z.string(),
      }),
    )
    // @ts-ignore: error due to MaybePromise instead of Promise
    .query(async (opts) => {
      const { input } = opts;
      const userIdOfHandle = await totomaClient.getHandleUser(input.handle);

      if (userIdOfHandle.data) {
        return {
          userId: userIdOfHandle.data[0].id,
        };
      }
    }),
});
