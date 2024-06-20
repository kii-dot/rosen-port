import { Container, ContainerStatus, Tx, TxStatus } from '@rosen-port/db';
import { IFundDistributor } from './types';
import {
  FundsTo,
  MCPWallet,
  MultiChainPayment,
} from '@rosen-port/multi-chain-payment';
import { RosenChainToken } from '@rosen-bridge/tokens';
import { Networks } from '@rosen-port/chains';
import { MNEMONIC } from '../../constants/mnemonicConstants';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';
import { IWalletClient, PortExecutor } from '../../types/executor';
import {
  DBUpdateFailureException,
  FundsNotBridgedException,
} from '@rosen-port/errors';
import { IRosenUserInterface } from '@rosen/sdk';
import { IFundDistributorStoreClient } from './storeClient';

export class FundDistributor extends PortExecutor implements IFundDistributor {
  container: Container;
  distributionTxId: string;
  fundDistributorStoreClient: IFundDistributorStoreClient;
  rosenUserInterface: IRosenUserInterface;
  txs: Tx[];

  constructor(
    container: Container,
    fundDistributorStoreClient: IFundDistributorStoreClient,
    rosenUserInterface: IRosenUserInterface,
    walletClient: IWalletClient
  ) {
    super();
    this.container = container;
    this.walletClient = walletClient;
    this.fundDistributorStoreClient = fundDistributorStoreClient;
    this.rosenUserInterface = rosenUserInterface;
  }

  async onExecute(): Promise<void> {
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
    const txs = await this.fundDistributorStoreClient.getContainerTxs(
      container.id
    );
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

    const rosenPortWalletAddress = await this.getPortWallet(
      this.container.destChain
    );

    txs.forEach(async (tx) => {
      if (tx.txStatus === TxStatus.bridged) {
        const fundsTo = {
          token: token[container.destChain],
          // Note: The tx.amount from Tx is the exact amount transferred
          // that has taken decimals into account.
          decimalAmount: tx.amount,
          toAddress: tx.destAddress,
        };
        to.push(fundsTo);
      }
    });

    // @ts-ignore
    const network = Networks[container.destChain];
    const unsignedTx = await MultiChainPayment.disperse({
      network,
      sourceAddress: rosenPortWalletAddress.walletAddress,
      to,
    });

    // create Wallet
    // @ts-ignore
    const walletMnemonic = MNEMONIC[container.destChain];
    const wallet = MCPWallet.create({ network, mnemonic: walletMnemonic });

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
    const dbResult =
      await this.fundDistributorStoreClient.updateDistributedTxId(
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
