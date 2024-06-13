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
import { PortExecutor } from '../../types/executor';
import { RosenChains, RosenUserInterface } from '@rosen/sdk';
import { MCPWallet } from '@rosen-port/multi-chain-payment';
import { MNEMONIC } from '../../constants/mnemonicConstants';

export class PortBridger extends PortExecutor implements IPortBridger {
  container: Container;
  db: RosenPortDBClient;
  bridgeTx: string = '';
  containerTxs: Tx[];
  rosenUI: RosenUserInterface;

  constructor(
    container: Container,
    db: RosenPortDBClient,
    rosenUI: RosenUserInterface
  ) {
    super();
    this.container = container;
    this.db = db;
    this.rosenUI = rosenUI;
  }

  async onExecute(): Promise<void> {
    this.bridgeTx = await this.bridgeContainer(this.container);
  }

  /**
   * Check if PortBridger is executable
   * on conditions:
   * 1. Container is not Bridged
   * 2. Container is filled up
   * 3. Wallet has enough funds
   */
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

  /**
   * Ensure DB Updated
   *
   * 1. Update container in db to bridging status
   */
  async onAfterExecute(): Promise<void> {
    // 4a. Update container in db to bridging status
    const isBridgeSuccessful = await this.isBridgeSuccessful(this.bridgeTx);
    if (isBridgeSuccessful) {
      // @todo Update with bridge TxId
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
    } else {
      Logger.error(
        '0',
        CronCategory.PortBridger,
        `[PortBridger] Container (${this.container.id}) Bridged successfully`
      );
    }
  }

  //#region PortBridger Utility Functions

  /**
   * Check explorer to see if a tx is bridged via explorer
   * @param bridgeTx
   */
  async isBridgeSuccessful(bridgeTx: string): Promise<boolean> {
    throw new NotImplementedException();
  }

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
   *
   * To get token minimum amount, we will have to get the minimum transfer
   * fee for the token.
   * @param container
   */
  async getTokenMinimumAmount(container: Container): Promise<bigint> {
    return await this.rosenUI.getMinimumTransferAmountForToken(
      // @ts-ignore
      container.sourceChain,
      container.tokenType.id,
      container.destChain
    );
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
    this.containerTxs = await this.db.tx.getContainerTxs(container.id);

    // 2. Check if all tx is confirmed
    // If not all tx is confirmed, we stop the
    // bridge
    var isAllTxConfirmed: boolean = true;
    const unconfirmedTxs: string[] = [];
    this.containerTxs.forEach((tx) => {
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
    const tokenMinimumAmount: bigint = await this.getTokenMinimumAmount(
      this.container
    );
    const totalAmount: number = this.containerTxs.reduce(
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
   * @todo kii this needs verification
   *
   * @param containerId ContainerId of container to be bridged
   * @returns boolean determining whether the bridging was successful
   */
  async bridgeContainer(container: Container): Promise<string> {
    // 3. Utilizing Rosen-SDK
    // 3a. Collect Input from wallets
    // 3b. bridge the funds
    const destWalletAddress = this.getPortWallet(container.destChain);
    const sourceWalletAddress = this.getPortWallet(container.sourceChain);
    const unsignedLockTx: string = await RosenChains.getLockTransaction(
      // @ts-ignore
      container.sourceChain,
      container.destChain,
      destWalletAddress,
      sourceWalletAddress,
      container.tokenType.id,
      container.totalAmount
    );

    // @ts-ignore
    const network = Networks[container.destChain];
    // @ts-ignore
    const walletMnemonic = MNEMONIC[container.destChain];
    const wallet = MCPWallet.create({ network, mnemonic: walletMnemonic });

    // Sign and send txs
    const tx = await wallet.signAndSubmit(unsignedLockTx);

    return tx;
  }

  /**
   * Update
   * - Bridge Status
   * - Bridged Time
   * - Bridge Tx Id
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
