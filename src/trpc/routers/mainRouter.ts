import { publicProcedure, router } from '#/trpc/generic';
import { dbClient } from '#/supabase';
import { z } from 'zod';
import { ContainerStatus, TxStatus } from '#/supabase/dbConstants';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Main Router:
 *
 * DONE GET - containers - api/trpc/main.containers
 * - receive limit, and index (int)
 * - get container column from (index) up to (limit)
 * DONE GET - container info - api/trpc/main.container
 * - receive containerId
 * - get all tx where containerId equals containerId value received
 * DONE GET - userTx - api/trpc/main.txs
 * - receive walletAddress
 * - get all tx where source_address | dest_address == wallet_address
 * - return txs
 * PUT - refund - api/trpc/main.refund
 * - receives txId for refund
 * - get tx row via txId
 * - check to see if tx status == confirmed
 * - change status to refund_initiated
 * - And create fleet tx
 *    to send refund service fee to client
 * POST - createTx - api/trpc/main.create
 * - receives (SourceChain, DestChain, TokenType, TokenAmount, DestChainAddress)
 * - try to get container with sourcechain, destchain, tokentype, and status == initiated
 *      - if does not exist, create a new container with (sourcechain, destchain, tokenType, status == initiated)
 * - create the txs to send to frontend to sign
 *        tx = userWallet -> rosenPort wallet (based on sourceChain)
 * - create a tx with foreign key linked to containerid, and txId from fleet tx
 *      in previous step
 */
export const mainRouter = router({
  ping: publicProcedure.query(async () => {
    return { message: 'pong: PageRouter working' };
  }),
  containers: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        index: z.number(),
      }),
    )
    .query(async ({ input }) => {
      // @todo kii add return for amount of tokens.
      const { data, error } = await dbClient.container.getContainers(input.limit, input.index);
      if (error) {
        return {
          error,
        };
      }

      return {
        data,
      };
    }),
  container: publicProcedure
    .input(
      z.object({
        containerId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      // @todo kii add return for amount of tokens.
      // Frontend should cache the data.
      const { data, error } = await dbClient.container.getContainer(input.containerId);

      if (error) {
        return {
          error,
        };
      }

      return {
        data,
      };
    }),
  txs: publicProcedure
    .input(
      z.object({
        walletAddress: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { data, error } = await dbClient.tx.getUserTxs(input.walletAddress);

      if (error) {
        return {
          error,
        };
      }

      return {
        data,
      };
    }),
  refund: publicProcedure
    .input(
      z.object({
        txId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // @todo kii the whole refund should be done here.
      // 1. Update data
      const { data, error } = await dbClient.tx.updateTxStatus(input.txId, TxStatus.refund_initiated);

      // 2. Verify data is correct
      //    a. Check explorer
      //    b. Create refundTx table to check if the refundTx exists
      // 3. Create Fleet Tx to refund
      // 4. Sign FleetTx (check security, may be ok for v1)
      // 5. Send user the txId
      if (error) {
        return {
          error,
        };
      }

      return {
        data,
      };
    }),
  create: publicProcedure
    .input(
      z.object({
        sourceChain: z.string(),
        destChain: z.string(),
        amount: z.number(),
        tokenType: z.string(),
        sourceAddress: z.string(),
        destChainAddress: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // 1. Get container to see if it exists
      //    where container.sourceChain,
      //    container.destChain,
      //    container.tokenType,
      //    container.status == ContainerStatus.Initiated
      const { data, error } = await dbClient.container.getContainerViaChain(
        input.sourceChain,
        input.destChain,
        input.tokenType,
        ContainerStatus.initiated,
      );

      if (error) {
        logAndThrow(error);
        return {
          error,
        };
      }

      // 1.5. If there is no container, create new container
      //      if not create tx.
      var containerId = '';
      if (data == null) {
        const containerData = await dbClient.container.createContainer(
          input.sourceChain,
          input.destChain,
          input.tokenType,
        );

        if (containerData !== null && containerData.data !== null) {
          containerId = containerData.data[0].id;
        } else {
          logAndThrow(error);
          return {
            error,
          };
        }
      } else {
        containerId = data[0].id;
      }

      // 2. Create Fleet Tx
      const txId = '8f88181a1426afc7467fa5e1d8fea87bf53a8ad32c8f6c2400ccb4a6c1217a03';
      // 3. Save Tx to database
      const txData = await dbClient.tx.createTx(
        txId,
        input.amount,
        input.sourceAddress,
        input.destChainAddress,
        containerId,
      );

      // 4. send back the tx to sign
      if (txData.error) {
        logAndThrow(error);
        return {
          error,
        };
      }

      return {
        data: txData.data,
      };
    }),
});

const logAndThrow = (error: PostgrestError | null) => {
  if (error) {
    console.log(error);
    return error;
  }
};
