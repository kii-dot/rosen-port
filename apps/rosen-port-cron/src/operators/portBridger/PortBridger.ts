import {
  Container,
  Tx,
  TxStatus,
  ContainerStatus,
  Wallet,
} from '@rosen-port/db';
import { IPortBridger } from './types';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';
import { PortExecutor } from '../../types/executor';
import { UnsignedTransaction } from 'ergo-lib-wasm-nodejs';
import {
  IRosenUserInterface,
  Fees,
  Networks,
  CardanoUtxo,
  RosenChains,
} from '@rosen/sdk';
import { getMnemonic } from '../../constants/mnemonicConstants';
import { ErgoBoxProxy } from '@rosen-ui/wallet-api';
import { IContainerTxStoreClient } from '../fundDistributor/storeClient';
import { IWalletClient } from '../utils/WalletClient';
import { getLockAddress } from '../../constants/lockAddressConstants';
import { getNetworks } from '../utils/networks';
import { parseTx } from '../utils/txParser';

export class PortBridger extends PortExecutor implements IPortBridger {
  container: Container;
  containerTxStoreClient: IContainerTxStoreClient;
  bridgeTx: string = '';
  containerTxs: Tx[];
  rosenUI: IRosenUserInterface;
  destChainNetwork: keyof typeof Networks;
  sourceChainNetwork: keyof typeof Networks;
  sourceWallet: Wallet;

  constructor(
    container: Container,
    containerTxStoreClient: IContainerTxStoreClient,
    rosenUI: IRosenUserInterface,
    walletClient: IWalletClient
  ) {
    super();
    this.container = container;
    this.containerTxStoreClient = containerTxStoreClient;
    this.rosenUI = rosenUI;
    this.walletClient = walletClient;
    this.destChainNetwork = getNetworks(container.destChain);
    this.sourceChainNetwork = getNetworks(container.sourceChain);
  }

  async onExecute(): Promise<void> {
    try {
      this.bridgeTx = await this.bridgeContainer(this.container);

      Logger.info(
        '0',
        CronCategory.PortBridger,
        '[PortBridger] Bridging was successful'
      );
    } catch (error) {
      Logger.error(
        '0',
        CronCategory.PortBridger,
        `[PortBridger] Bridging failed with error: ${error}`
      );
      throw error;
    }
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
  }

  /**
   * Ensure DB Updated
   *
   * 1. Update container in db to bridging status
   */
  async onAfterExecute(): Promise<void> {
    // 4a. Update container in db to bridging status
    try {
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
    } catch (error) {
      Logger.error(
        '0',
        CronCategory.PortBridger,
        `[PortBridger] Container (${this.container.id}) Bridged unsuccessful with error ${error}`
      );
    }
  }

  //#region PortBridger Utility Functions

  isContainerBridged(container: Container): boolean {
    return (
      container.status === ContainerStatus.bridged ||
      container.status === ContainerStatus.bridging
    );
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
      container.destChain,
      -1
    );
  }

  //#endregion

  getContainerTotalAmount(): number {
    const totalAmount: number = this.containerTxs.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      0
    );

    return totalAmount;
  }

  /**
   * Checks to see if a container has its minimum value filled.
   * Returns the value 0 - >1. Where 1 equals 100%
   *
   * @param containerId The containerId to be checked
   * @returns whether the containerId has been filled up to 100%
   */
  async isContainerFilled(container: Container): Promise<boolean> {
    // 1. Get txs
    this.containerTxs = await this.containerTxStoreClient.getContainerTxs(
      container.id
    );

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
    const totalAmount: number = this.getContainerTotalAmount();

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
    const destWalletAddress = await this.getPortWalletInfo(container.destChain);
    const fees: Fees = await this.rosenUI.getFeeByTransferAmount(
      // @ts-ignore Networks
      container.sourceChain,
      container.tokenType.id,
      container.destChain,
      container.totalAmount,
      -1n,
      -1
    );

    // @todo kii Get the wallet utxo
    this.walletClient.setNetwork(this.sourceChainNetwork);
    const walletMnemonic = getMnemonic(this.sourceChainNetwork);
    const mcpWallet = this.walletClient.getMCPWallet();
    const wallet = mcpWallet.create(walletMnemonic);
    const walletUtxo: Iterator<CardanoUtxo | ErgoBoxProxy, undefined> = (
      await wallet.getUtxos()
    ).values();
    const unsignedLockTx: string | UnsignedTransaction =
      await RosenChains.generateUnsignedBridgeTx(
        // @ts-ignore
        container.sourceChain,
        container.destChain,
        destWalletAddress.walletAddress,
        this.sourceWallet.walletAddress,
        container.tokenType.id,
        container.totalAmount,
        fees.bridgeFee,
        fees.networkFee,
        walletUtxo,
        getLockAddress(this.sourceChainNetwork)
      );

    // @todo kii create a converter from unsigned_transaction to EIP12UnsignedTransaction
    // if the transaction is ergo
    // Sign and send txs
    // @ts-ignore
    const tx = await wallet.signAndSubmit(parsedTx);

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
    const container = this.containerTxStoreClient.updateContainerStatus(
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
