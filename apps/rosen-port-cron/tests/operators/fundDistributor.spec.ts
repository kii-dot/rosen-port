import { describe, expect, it } from 'vitest';
import { FundDistributor } from '../../src/operators';
import { IWalletClient } from '../../src/types/executor';
import { bridgedTxs, testContainers } from './mock';
import { TestContainerTxStoreClientFactory } from './testClasses/TestFundDistributorStoreClient';
import { TestWalletClientFactory } from './testClasses/TestWalletClient';
import { ContainerStatus } from '@rosen-port/db';
import { testRosenUI } from '../testUtils/testRosenUI';
import { IContainerTxStoreClient } from '../../src/operators/fundDistributor/storeClient';

var containerTxStoreClient: IContainerTxStoreClient =
  TestContainerTxStoreClientFactory.generate();
var walletClient: IWalletClient = TestWalletClientFactory.generate();

describe('FundDistributor', async () => {
  describe('execute', async () => {
    // 1. Initialize FundDistributor
    // 2. run FundDistributor.execute
    it('fails with unbridged container', async () => {
      const fundDistributor = new FundDistributor(
        testContainers.unbridged,
        containerTxStoreClient,
        testRosenUI,
        walletClient
      );
      await expect(
        async () => await fundDistributor.execute()
      ).rejects.toThrowError();
    });

    /**
     * @todo kii Complete this
     */
    test.skip('passes with bridged container', async () => {
      const fundDistributor = new FundDistributor(
        testContainers.bridged,
        containerTxStoreClient,
        testRosenUI,
        walletClient
      );

      await fundDistributor.execute();
    });
  });

  /**
   * @todo kii Complete this
   */
  describe('distributeFunds', async () => {
    // 1. Ensure that it gets valid strings for cardano, ergo, bitcoin
  });

  describe('ensureBridged', () => {
    // 1. check a valid container that has been bridged
    var fundDistributor = new FundDistributor(
      testContainers.unbridged,
      containerTxStoreClient,
      testRosenUI,
      walletClient
    );

    it('bridged container', () => {
      expect(() => fundDistributor.ensureBridged(testContainers.bridged));
    });

    describe('unbridged container', () => {
      const testContainerWithStatus = (status: ContainerStatus) => {
        var testContainer = testContainers.unbridged;
        it(`${status}`, () => {
          testContainer.status = status;
          expect(testContainer.status).toBe(status);

          // To fail!
          expect(() =>
            fundDistributor.ensureBridged(testContainer)
          ).toThrowError();
        });
      };

      testContainerWithStatus(ContainerStatus.bridging);
      testContainerWithStatus(ContainerStatus.filled);
      testContainerWithStatus(ContainerStatus.filling_in_progress);
      testContainerWithStatus(ContainerStatus.fund_distribution_in_progress);
      testContainerWithStatus(ContainerStatus.funds_distributed);
      testContainerWithStatus(ContainerStatus.initiated);
    });
  });

  it('getContainerTxs', async () => {
    // 1. makes sure the fundDistributorStoreClient returns the txs
    const testContainer = testContainers.bridged;
    var fundDistributor = new FundDistributor(
      testContainer,
      containerTxStoreClient,
      testRosenUI,
      walletClient
    );

    const txs = await fundDistributor.getContainerTxs(testContainer);

    expect(txs).toStrictEqual(bridgedTxs);
  });

  it('updateDistributedTx', async () => {
    // Ensure we generate a clean one.
    containerTxStoreClient = TestContainerTxStoreClientFactory.generate();
    walletClient = TestWalletClientFactory.generate();

    // 1. Ensure the stores is updated
    const testContainer = testContainers.bridged;
    var fundDistributor = new FundDistributor(
      testContainer,
      containerTxStoreClient,
      testRosenUI,
      walletClient
    );
    const updatedTxId = 'updatedTxId';
    const updated = await fundDistributor.updateDistributedTx(updatedTxId);
    expect(updated).toBeTruthy();
    const updatedTxs = await containerTxStoreClient.getContainerTxs(
      testContainer.id
    );

    updatedTxs.forEach((tx) => {
      expect(tx.distributedTxId).toBe(updatedTxId);
    });
  });
});
