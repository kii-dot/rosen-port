import { Tx, TxStatus } from '@rosen-port/db';
import { IFundDistributorStoreClient } from '../../../src/operators/fundDistributor/storeClient';

export const unbridgedTxs = [
  new Tx({
    id: 'confirmedTx2',
    createdAt: '2024-06-20T12:00:00Z',
    initiatedTxId: 'init1',
    amount: 1000,
    sourceAddress: 'addr1',
    destAddress: 'addr2',
    txStatus: TxStatus.confirmed,
    distributedTxId: '',
    containerId: 'confirmedContainer',
  }),

  new Tx({
    id: 'confirmedTx2',
    createdAt: '2024-06-20T12:00:00Z',
    initiatedTxId: 'init1',
    amount: 1000,
    sourceAddress: 'addr1',
    destAddress: 'addr2',
    txStatus: TxStatus.confirmed,
    distributedTxId: '',
    containerId: 'confirmedContainer',
  }),
];

export const bridgedTxs: Tx[] = [
  new Tx({
    id: 'bridgedTx',
    createdAt: '2024-06-20T12:10:00Z',
    initiatedTxId: 'init2',
    amount: 200,
    sourceAddress: 'addr3',
    destAddress: 'addr4',
    txStatus: TxStatus.bridged,
    distributedTxId: 'dist2',
    containerId: 'bridgedContainer',
  }),
];

export class TestFundDistributorStoreClient
  implements IFundDistributorStoreClient
{
  private txStore: Tx[];

  constructor() {
    this.txStore = []; // Initializes an empty array to store Tx objects.
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

export class TestFundDistributorStoreClientFactory {
  static generate(): TestFundDistributorStoreClient {
    const testClient = new TestFundDistributorStoreClient();

    unbridgedTxs.forEach((tx) => {
      testClient.addTransaction(tx);
    });

    bridgedTxs.forEach((tx) => {
      testClient.addTransaction(tx);
    });

    return testClient;
  }
}
