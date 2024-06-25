import { Container, ContainerStatus, Tx, TxStatus } from '@rosen-port/db';
import { IFundDistributor } from './types';
import { FundsTo, IMultiChainPayment } from '@rosen-port/multi-chain-payment';
import { RosenChainToken } from '@rosen-bridge/tokens';
import { Networks } from '@rosen-port/chains';
import { MNEMONIC, getMnemonic } from '../../constants/mnemonicConstants';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';
import { PortExecutor } from '../../types/executor';
import { DBUpdateFailureException } from '@rosen-port/errors';
import { IRosenUserInterface } from '@rosen/sdk';
import { IContainerTxStoreClient } from './storeClient';
import { FundsNotBridgedException } from '../../errors/bridgerErrors';
import { IWalletClient } from '../utils/WalletClient';
import { getNetworks } from '../utils/networks';

export class FundDistributor extends PortExecutor implements IFundDistributor {
  container: Container;
  distributionTxId: string;
  containerTxStoreClient: IContainerTxStoreClient;
  rosenUserInterface: IRosenUserInterface;
  txs: Tx[];
  destChainNetwork: keyof typeof Networks;

  constructor(
    container: Container,
    containerTxStoreClient: IContainerTxStoreClient,
    rosenUserInterface: IRosenUserInterface,
    walletClient: IWalletClient
  ) {
    super();
    this.container = container;
    this.walletClient = walletClient;
    this.containerTxStoreClient = containerTxStoreClient;
    this.rosenUserInterface = rosenUserInterface;
    // In FundDistributor, we've already landed on destchain side and
    // do not need to bother about sourceChain side
    this.destChainNetwork = getNetworks(container.destChain);
  }

  async onExecute(): Promise<void> {
    try {
      Logger.info(
        '0',
        CronCategory.FundDistributor,
        '[FundDistributorCron] Distribute funds start'
      );

      this.distributionTxId = await this.distributeFunds(
        this.container,
        this.txs
      );

      if (this.distributionTxId === '') {
        Logger.error(
          '0',
          CronCategory.FundDistributor,
          `[FundDistributorCron] Failure to distribute funds: ${this.distributionTxId}`
        );
      } else {
        Logger.info(
          '0',
          CronCategory.FundDistributor,
          `[FundDistributorCron] Funds Distributed with txId - ${this.distributionTxId}`
        );
      }
    } catch (error) {
      Logger.error(
        '0',
        CronCategory.FundDistributor,
        `[FundDistributorCron] Failure to distribute funds: ${this.distributionTxId}`
      );
      throw error;
    }
  }

  async onBeforeExecute(): Promise<void> {
    this.txs = await this.getContainerTxs(this.container);
    this.ensureBridged(this.container);
  }

  async onAfterExecute(): Promise<void> {
    const updateSuccessful = await this.updateDistributedTx(
      this.distributionTxId
    );

    if (updateSuccessful) {
      Logger.info(
        '0',
        CronCategory.FundDistributor,
        `[FundDistributorCron] Funds Distributed updated txId - ${this.distributionTxId}`
      );
    } else {
      Logger.error(
        '0',
        CronCategory.FundDistributor,
        `[FundDistributorCron] FAILED: Funds Distributed with distributed txId - ${this.distributionTxId}`
      );

      // with this error, at least we can catch it and retry
      // We surround the id with [] in case we need to parse the string
      // and retry
      throw new DBUpdateFailureException(
        `Funds Distributed failed to update containerID [${this.container.id}] with distributionId [${this.distributionTxId}]`
      );
    }
  }

  /**
   * Checks the DB and the explorer to identify whether
   * a container has been bridged.
   *
   * @param containerId Id of container to be checked
   * @returns boolean, true represent bridged, false represents
   *          unbridged
   */
  ensureBridged(container: Container): void {
    // 1. Check if container is bridged
    // When a container is bridged, the funds have been received.
    // This check is done in StatusChecker.
    const isBridged = container.status === ContainerStatus.bridged;

    if (!isBridged) {
      throw new FundsNotBridgedException();
    }
  }

  async getContainerTxs(container: Container): Promise<Tx[]> {
    const txs = await this.containerTxStoreClient.getContainerTxs(container.id);
    return txs;
  }

  /**
   * Distributes funds that have been bridged.
   * Each tx that are distributed are updated in the DB.
   *
   * @param containerId Id of container to be distributed
   * @returns boolean, true represents distributed, false
   *          represents failure in distribution.
   */
  async distributeFunds(container: Container, txs: Tx[]): Promise<string> {
    const to: Array<FundsTo> = [];
    const tokenId = container.tokenType.tokenId;
    const token: RosenChainToken =
      this.rosenUserInterface.getTokenDetailsOnTargetChain(
        container.sourceChain,
        tokenId,
        container.destChain
      );

    const rosenPortWalletAddress = await this.getPortWalletInfo(
      this.container.destChain
    );

    txs.forEach(async (tx) => {
      if (tx.txStatus === TxStatus.bridged) {
        const fundsTo = {
          token: token[this.destChainNetwork],
          // Note: The tx.amount from Tx is the exact amount transferred
          // that has taken decimals into account.
          decimalAmount: tx.amount,
          toAddress: tx.destAddress,
        };
        to.push(fundsTo);
      }
    });

    const network: keyof typeof Networks = getNetworks(this.destChainNetwork);
    this.walletClient.setNetwork(network);
    const multiChainPayment: IMultiChainPayment =
      this.walletClient.getMultiChainPayment();
    const unsignedTx = await multiChainPayment.disperse(
      rosenPortWalletAddress.walletAddress,
      to
    );

    // create Wallet
    const walletMnemonic = getMnemonic(this.destChainNetwork);
    const mcpWallet = this.walletClient.getMCPWallet();
    const wallet = mcpWallet.create(walletMnemonic);

    // Sign and send txs
    const tx = await wallet.signAndSubmit(unsignedTx);
    return tx;
  }

  /**
   * Updates the tx status of the tx with the txId in db
   * to distributed
   *
   * @param txId Id of Tx that has been distributed
   * @returns boolean, true represents updated, false
   *          represents failure to update db.
   */
  async updateDistributedTx(txId: string): Promise<boolean> {
    const dbResult = await this.containerTxStoreClient.updateDistributedTxId(
      txId,
      this.container.id
    );

    var isAllUpdated: boolean = true;

    dbResult.forEach((tx) => {
      if (!(tx.distributedTxId === txId && tx.txStatus === TxStatus.sent)) {
        isAllUpdated = false;
      }
    });

    if (isAllUpdated) {
      return true;
    } else {
      return false;
    }
  }
}
