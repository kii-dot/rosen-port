import { RosenPortDBClient, Tx, TxStatus } from '@rosen-port/db';

/**
 * This class is needed to use as an injection method into FundDistributor.
 * For testing purposes and for simplification, to prevent DBClient from
 * getting too bulky
 */
export interface IFundDistributorStoreClient {
  getContainerTxs(id: string): Promise<Tx[]>;
  updateDistributedTxId(txId: string, containerId: string): Promise<Tx[]>;
}

export class FundDistributorStoreClient implements IFundDistributorStoreClient {
  dbClient: RosenPortDBClient;
  constructor(dbClient: RosenPortDBClient) {
    this.dbClient = dbClient;
  }

  async getContainerTxs(id: string): Promise<Tx[]> {
    return await this.dbClient.tx.getContainerTxs(id);
  }

  /**
   * @param distributedTxId
   * @param containerId
   * @returns
   */
  async updateDistributedTxId(
    distributedTxId: string,
    containerId: string
  ): Promise<Tx[]> {
    return await this.dbClient.tx.updateDistributedTxId(
      distributedTxId,
      containerId,
      TxStatus.sent
    );
  }
}
