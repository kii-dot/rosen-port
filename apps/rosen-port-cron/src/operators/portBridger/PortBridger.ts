import {
  Container,
  RosenPortDBClient,
  Tx,
  TxStatus,
  ContainerStatus,
} from '@rosen-port/db';
import { NotImplementedException } from '@rosen-port/errors';
import { IPortBridger } from './types';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';
import { Executor } from '../../types/executor';

export class PortBridger extends Executor implements IPortBridger {
  container: Container;
  db: RosenPortDBClient;
  isBridgeSuccessful: boolean = false;

  constructor(container: Container, db: RosenPortDBClient) {
    super();
    this.container = container;
    this.db = db;
  }

  async onExecute(): Promise<void> {
    this.isBridgeSuccessful = await this.bridgeContainer(this.container.id);

    if (this.isBridgeSuccessful) {
      Logger.error(
        '0',
        CronCategory.PortBridger,
        `[PortBridger] Container (${this.container.id}) Bridged successfully`
      );
    }
  }

  async onBeforeExecute(): Promise<void> {
    // 2a. Double check to see if the container has not been bridged
    const isContainerBridged = this.isContainerBridged(this.container);

    if (isContainerBridged) {
      Logger.error(
        '0',
        CronCategory.PortBridger,
        '[PortBridger] Container has already been bridged'
      );

      throw new Error('Container has already been bridged');
    }
    // 2b. Double check to see if tx did fill up container
    const isContainerFilled = await this.isContainerFilled(this.container);

    if (!isContainerFilled) {
      Logger.error(
        '0',
        CronCategory.PortBridger,
        '[PortBridger] Container has not been filled yet'
      );

      throw new Error('Container has not been filled');
    }

    // 2c. Double check to see if the wallet has enough funds
    const isWalletFunded = await this.isWalletFunded(this.container);

    if (!isWalletFunded) {
      Logger.fatal(
        '0',
        CronCategory.PortBridger,
        '[PortBridger] Fatal error: Wallet has not been funded yet. There is a problem!'
      );

      throw new Error('Wallet not funded');
    }
  }

  async onAfterExecute(): Promise<void> {
    // 4a. Update container in db to bridging status
    if (this.isBridgeSuccessful) {
      const isBridgedDBUpdated = await this.updateContainerStatus(
        this.container.id
      );

      if (isBridgedDBUpdated) {
        Logger.info(
          '0',
          CronCategory.PortBridger,
          '[PortBridger] DB updated as bridged'
        );
      }
    }
  }

  //#region PortBridger Utility Functions

  isContainerBridged(container: Container): boolean {
    return (
      container.status === ContainerStatus.bridged ||
      container.status === ContainerStatus.bridging
    );
  }

  async isWalletFunded(container: Container): Promise<boolean> {
    throw new NotImplementedException();
  }

  /**
   * Note: We should cache this value so that we can save on resources
   * We get the value, cache it, if the new comparison exceeds the cache
   * value, we do another check with Rosen-SDK to ensure the sdk has a
   * correct value as compared to cached.
   * @param container
   */
  async getTokenMinimumAmount(container: Container): Promise<number> {
    throw new NotImplementedException();
  }

  //#endregion

  /**
   * Checks to see if a container has its minimum value filled.
   * Returns the value 0 - >1. Where 1 equals 100%
   *
   * @param containerId The containerId to be checked
   * @returns whether the containerId has been filled up to 100%
   */
  async isContainerFilled(container: Container): Promise<boolean> {
    // 1. Get txs
    const txs: Tx[] = await this.db.tx.getContainerTxs(container.id);

    // 2. Check if all tx is confirmed
    // If not all tx is confirmed, we stop the
    // bridge
    var isAllTxConfirmed: boolean = true;
    const unconfirmedTxs: string[] = [];
    txs.forEach((tx) => {
      if (tx.txStatus !== TxStatus.confirmed) {
        isAllTxConfirmed = false;
        unconfirmedTxs.push(tx.initiatedTxId);
      }
    });

    if (!isAllTxConfirmed) {
      Logger.info(
        '0',
        CronCategory.PortBridger,
        `[PortBridger] Txs are not confirmed ${unconfirmedTxs.concat(', ')}`
      );
      return false;
    }

    // 3. Check to see if amount is filled
    // If not, we return false, we do this before
    // comparing in explorer so that we do not waste
    // resource and its performant.
    const tokenMinimumAmount: number = await this.getTokenMinimumAmount(
      this.container
    );
    const totalAmount: number = txs.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      0
    );

    if (totalAmount < tokenMinimumAmount) {
      Logger.info(
        '0',
        CronCategory.PortBridger,
        '[PortBridger] Amount insufficient for bridging'
      );
      return false;
    }

    Logger.info(
      '0',
      CronCategory.PortBridger,
      `[PortBridger] Container with id (${container.id}) ready for bridging`
    );
    return true;
  }

  /**
   * Bridges a container via rosenPort. All info are captured in db.
   * Checks to see if container is filled first. If Container is not
   * filled, it logs a message and then wait till next cron job run.
   *
   * @param containerId ContainerId of container to be bridged
   * @returns boolean determining whether the bridging was successful
   */
  async bridgeContainer(containerId: string): Promise<boolean> {
    // 3. Utilizing Rosen-SDK
    // 3a. Collect Input from wallets
    // 3b. bridge the funds
    throw new Error('Not Implemented');
  }

  /**
   *
   * @param containerId Id of container
   * @returns whether the db was updated
   */
  async updateContainerStatus(containerId: string): Promise<boolean> {
    const container = this.db.container.updateContainerStatus(
      containerId,
      ContainerStatus.bridging
    );

    if (container !== null) {
      return true;
    } else {
      Logger.error(
        '0',
        CronCategory.PortBridger,
        `[PortBridger] Container bridged, but Db was not updated, containerId - ${containerId}`
      );

      return false;
    }
  }
}
