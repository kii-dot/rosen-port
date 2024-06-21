import { describe, expect, it } from 'vitest';
import { PortBridger } from '../../src/operators';
import { IContainerTxStoreClient } from '../../src/operators/fundDistributor/storeClient';
import { IWalletClient } from '../../src/types/executor';
import { testRosenUI } from '../testUtils/testRosenUI';
import { TestContainerTxStoreClientFactory } from './testClasses/TestFundDistributorStoreClient';
import { TestWalletClientFactory } from './testClasses/TestWalletClient';

var containerTxStoreClient: IContainerTxStoreClient =
  TestContainerTxStoreClientFactory.generate();
var walletClient: IWalletClient = TestWalletClientFactory.generate();
describe('PortBridger', async () => {
  describe('execute', async () => {
    it('fails with unfunded bridge', async () => {
      const portBridger = new PortBridger(
        container,
        containerTxStoreClient,
        testRosenUI,
        walletClient
      );

      await expect(
        async () => await portBridger.execute()
      ).rejects.toThrowError();
    });

    /**
     * @todo kii Complete this
     */
    test.skip('passes with funded bridge', async () => {
      const portBridger = new PortBridger(
        container,
        containerTxStoreClient,
        testRosenUI,
        walletClient
      );

      await portBridger.execute();
    });
  });

  describe('isContainerFilled', async () => {});

  describe('bridgeContainer', async () => {});
  describe('updateContainerStatus', async () => {});
});
