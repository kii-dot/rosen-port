import { publicProcedure, router } from '#/trpc/generic';
import { dbClient } from '#/tools/db';
import { z } from 'zod';
import { ContainerStatus, TxStatus, Tx } from '@rosen-port/db';
import logger from '#/tools/logger';
import {
  ContainerNotAvailableError,
  NoContainersFoundError,
  NoTxFoundError,
  TxNotAvailableError,
} from '#/errors/RouterErrors';

/**
 * The `mainRouter` is responsible for handling various API requests related
 * to containers and transactions within a blockchain-based system. It uses
 * tRPC for creating type-safe APIs and integrates with a Supabase backend.
 *
 * GET - containers - api/trpc/main.containers
 * GET - container info - api/trpc/main.container
 * GET - userTx - api/trpc/main.txs
 * PUT - refund - api/trpc/main.refund
 * PUT - UpdateTxAsSigned - api/trpc/main.updateTxAsSigned
 * POST - createTx - api/trpc/main.create
 */
export const mainRouter = router({
  /**
   * Simple ping endpoint to check the health of the router.
   */
  ping: publicProcedure.query(async () => {
    return { message: 'pong: mainRouter working' };
  }),
  /*
   * DONE GET - containers - api/trpc/main.containers
   *
   * Fetches a list of containers starting from a given index with a set limit,
   * and calculates the total transaction amount for each container.
   *
   * <input>
   * limit: number
   * index: number
   * </input>
   *
   * <return>
   * containers: Container[]
   * </return>
   */
  containers: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        index: z.number(),
      }),
    )
    .query(async ({ input }) => {
      try {
        var containers = await dbClient.container.getContainers(input.limit, input.index);

        for (let container of containers) {
          const txs = await dbClient.tx.getContainerTxs(container.id);

          container.totalAmount = txs.reduce((acc: number, tx: Tx) => acc + Number(tx.amount), 0) || 0;
        }

        return { containers: containers };
      } catch (error) {
        const noContainersFoundError = new NoContainersFoundError(error);
        logger.error(noContainersFoundError.errorMessage);
        return { error: noContainersFoundError.error };
      }
    }),
  /*
   * DONE GET - container info - api/trpc/main.container
   *
   * Retrieves detailed information about a specific container including
   * all transactions associated with it.
   *
   * <input>
   * containerId: string
   * </input>
   *
   * <return>
   * container: Container
   * txs: Tx[]
   * </return>
   */
  container: publicProcedure
    .input(
      z.object({
        containerId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        var container = await dbClient.container.getContainer(input.containerId);

        const txs = await dbClient.tx.getContainerTxs(input.containerId);
        const amount = txs.reduce((acc: number, tx) => acc + Number(tx.amount), 0) || 0;
        container.totalAmount = amount;
        return {
          container: container,
          txs,
        };
      } catch (error) {
        const containerNotAvailableError = new ContainerNotAvailableError(input.containerId, error);
        logger.error(containerNotAvailableError.errorMessage);

        return { error: containerNotAvailableError.error };
      }
    }),
  /*
   * DONE GET - userTx - api/trpc/main.txs
   *
   * Fetches all transactions associated with a given wallet address,
   * where the wallet is either the source address or the destination address.
   *
   * <input>
   * walletAddress: string
   * </input>
   *
   * <return>
   * txs: Tx[]
   * </return>
   */
  txs: publicProcedure
    .input(
      z.object({
        walletAddress: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const txs = await dbClient.tx.getUserTxs(input.walletAddress);

        return {
          txs,
        };
      } catch (error) {
        const noTxFoundError = new NoTxFoundError(error);
        logger.error(noTxFoundError.errorMessage);
        return {
          error: noTxFoundError.error,
        };
      }
    }),
  /*
   * PUT - refund - api/trpc/main.refund
   *
   * - get tx row via txId
   * - check to see if tx status == confirmed
   * - change status to refund_initiated
   * - And create fleet tx
   *    to send refund service fee to client
   * Initiates a refund for a transaction that has been confirmed,
   * changing its status and potentially initiating a new transaction
   * for refund purposes.
   *
   * <input>
   * txId: string
   * </input>
   *
   * <return>
   * updatedTx: Tx
   * </return>
   */
  refund: publicProcedure
    .input(
      z.object({
        txId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // @todo kii the whole refund should be done here.
        // 1. Update data
        const txData = await dbClient.tx.getTx(input.txId);
        if (txData !== null) {
          const tx = txData;

          // If Tx is not confirmed, throw error
          if (tx.txStatus !== TxStatus.confirmed) {
            return {
              error: 'Tx cannot be refunded: tx is not in confirmed state and cannot be refunded.',
            };
          }

          // 2. Verify data is correct
          //    a. Check explorer to see if there is a service fee paid
          //    b. Create refundTx table to check if the refundTx exists
          const updatedTx = await dbClient.tx.updateTxStatus(input.txId, TxStatus.refund_initiated);
          if (updatedTx !== null) {
            return {
              updatedTx,
            };
          }
        }
      } catch (error) {
        const txNotAvailableError = new TxNotAvailableError(input.txId, error);
        logger.error(txNotAvailableError.errorMessage);
        return {
          error: txNotAvailableError.error,
        };
      }
    }),
  /*
   * DONE PUT - UpdateTxAsSigned - api/trpc/main.updateTxAsSigned
   *
   * Updates the status of a transaction to mark it as 'signed' by the user.
   * This is done after user has signed the tx. The Tx is created and signed
   * on the frontend.
   *
   * <input>
   * txId: string
   * </input>
   *
   * <return>
   * updatedTx: Tx
   * </return>
   */
  updateTxAsSigned: publicProcedure
    .input(
      z.object({
        txId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const tx = await dbClient.tx.updateTxStatus(input.txId, TxStatus.unconfirmed);

        return {
          updatedTx: tx,
        };
      } catch (error) {
        const txNotAvailableError = new TxNotAvailableError(input.txId, error);
        logger.error(txNotAvailableError.errorMessage);
        return {
          error: txNotAvailableError.error,
        };
      }
    }),
  /*
   * DONE POST - createTx - api/trpc/main.create
   *
   * - try to get container with sourcechain, destchain, tokentype, and status == initiated
   *      - if does not exist, create a new container with (sourcechain, destchain, tokenType, status == initiated)
   * Creates a new transaction, potentially creating a new container if one
   * with the specified characteristics does not exist.
   * The tx is created and signed from the client side.
   *
   * <input>
   * txId: string
   * sourceChain: string
   * destChain: string
   * tokenType: string
   * tokenAmount: number
   * sourceChainAddress: string
   * destChainAddress: string
   * </input>
   *
   * <return>
   * tx: Tx
   * </return>
   */
  create: publicProcedure
    .input(
      z.object({
        txId: z.string(),
        sourceChain: z.string(),
        destChain: z.string(),
        amount: z.number(),
        tokenType: z.string(),
        sourceAddress: z.string(),
        destChainAddress: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // 1. Get container to see if it exists
        //    where container.sourceChain,
        //    container.destChain,
        //    container.tokenType,
        //    container.status == ContainerStatus.Initiated
        const container = await dbClient.container.getContainerViaChain(
          input.sourceChain,
          input.destChain,
          input.tokenType,
          ContainerStatus.initiated,
        );

        // 1.5. If there is no container, create new container
        //      if not create tx.
        var containerId = '';
        if (container === null) {
          const createdContainer = await dbClient.container.createContainer(
            input.sourceChain,
            input.destChain,
            input.tokenType,
          );

          containerId = createdContainer.id;
        } else {
          containerId = container[0].id;
        }

        // 3. Save Tx to database
        const tx = await dbClient.tx.createTx(
          input.txId,
          input.amount,
          input.sourceAddress,
          input.destChainAddress,
          containerId,
        );

        return {
          tx,
        };
      } catch (error) {
        logger.error(error);
        return {
          error,
        };
      }
    }),
});
