import { Container, ContainerStatus, Tx, TxStatus } from '@rosen-port/db';
import { IContainerTxStoreClient } from '../../../src/operators/fundDistributor/storeClient';
import { bridgedTxs, confirmedTxs } from '../mock';
import { NotImplementedException } from '@rosen-port/errors';

export class TestContainerTxStoreClient implements IContainerTxStoreClient {
  private txStore: Tx[];
  private containerStore: Container[];

  constructor() {
    this.txStore = []; // Initializes an empty array to store Tx objects.
    this.containerStore = [];
  }

  async updateContainerStatus(
    containerId: string,
    containerStatus: ContainerStatus
  ): Promise<Container> {
    this.containerStore = this.containerStore.map((container) => {
      if (container.id === containerId) {
        return { ...container, txStatus: containerStatus };
      }
      return container;
    });

    const container = this.containerStore.filter(
      (container) => container.id === containerId
    );

    if (container.length > 0) return container[0];
    else throw new Error(`No container found for ${containerId}`);
  }

  async getContainerTxs(id: string): Promise<Tx[]> {
    // Filter transactions that belong to the specified container ID.
    return this.txStore.filter((tx) => tx.containerId === id);
  }

  async updateDistributedTxId(
    txId: string,
    containerId: string
  ): Promise<Tx[]> {
    // Update the distributedTxId for all transactions with the same containerId.
    this.txStore = this.txStore.map((tx) => {
      if (tx.containerId === containerId) {
        return { ...tx, distributedTxId: txId, txStatus: TxStatus.sent };
      }
      return tx;
    });

    // Return the updated list of transactions for the specified container ID.
    return this.getContainerTxs(containerId);
  }

  // Method to add transactions to the store for testing purposes.
  addTransaction(tx: Tx) {
    this.txStore.push(tx);
  }
}

export class TestContainerTxStoreClientFactory {
  static generate(): IContainerTxStoreClient {
    const testClient = new TestContainerTxStoreClient();

    confirmedTxs.forEach((tx) => {
      testClient.addTransaction(tx);
    });

    bridgedTxs.forEach((tx) => {
      testClient.addTransaction(tx);
    });

    return testClient;
  }
}
