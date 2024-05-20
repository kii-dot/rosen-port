import {
  Container,
  ContainerStatus,
  RosenPortDBClient,
  TxStatus,
} from '@rosen-port/db';
import { IFundDistributor } from './types';
import {
  FundsTo,
  MCPWallet,
  MultiChainPayment,
} from '@rosen-port/multi-chain-payment';
import { TokenMap } from '@rosen-bridge/tokens';
import { Networks } from '@rosen-port/chains';
import { MNEMONIC } from '../../constants/mnemonicConstants';
import { Logger } from '../../logging';
import { CronCategory } from '../../constants/cronConstants';
import { Executor } from '../../types/executor';

export class FundDistributor extends Executor implements IFundDistributor {
  tokenMap: TokenMap;
  container: Container;
  updatedTxId: string;
  db: RosenPortDBClient;

  constructor(tokenMap: TokenMap, container: Container, db: RosenPortDBClient) {
    super();
    this.tokenMap = tokenMap;
    this.container = container;
    this.db = db;
  }

  async onExecute(): Promise<void> {
    Logger.info(
      '0',
      CronCategory.FundDistributor,
      '[FundDistributorCron] Distribute funds start'
    );

    this.updatedTxId = await this.distributeFunds(this.container);

    if (this.updatedTxId === '') {
      Logger.error(
        '0',
        CronCategory.FundDistributor,
        `[FundDistributorCron] Failure to distribute funds: ${this.updatedTxId}`
      );
    } else {
      Logger.info(
        '0',
        CronCategory.FundDistributor,
        `[FundDistributorCron] Funds Distributed with txId - ${this.updatedTxId}`
      );
    }
  }

  async onBeforeExecute(): Promise<void> {
    await this.ensureBridged(this.container);
  }

  async onAfterExecute(): Promise<void> {
    await this.updateDistributedTx(this.updatedTxId);
  }

  /**
   * Checks the DB and the explorer to identify whether
   * a container has been bridged.
   *
   * @param containerId Id of container to be checked
   * @returns boolean, true represent bridged, false represents
   *          unbridged
   */
  async ensureBridged(container: Container): Promise<void> {
    // 1. Check if container is bridged
    const isBridged = container.status === ContainerStatus.bridged;

    if (!isBridged) {
      throw new Error('Funds not bridged');
    }

    // @todo kii
    // 2. Check if the wallet has received the funds.
    const isFundsReceived = await this.hasRosenWalletReceivedFunds();

    if (!isFundsReceived) {
      throw new Error('Funds not Received');
    }
  }

  /**
   * Distributes funds that have been bridged.
   * Each tx that are distributed are updated in the DB.
   *
   * @param containerId Id of container to be distributed
   * @returns boolean, true represents distributed, false
   *          represents failure in distribution.
   */
  async distributeFunds(container: Container): Promise<string> {
    const txs = await this.db.tx.getContainerTxs(this.container.id);
    const to: Array<FundsTo> = [];
    const token = container.tokenType.tokenId;
    const rosenChainTokens = this.tokenMap.search(container.destChain, {
      tokenId: token,
    });
    const rosenPortWalletAddress = await this.db.wallet.getWallet(
      container.destChain
    );
    txs.forEach(async (tx) => {
      if (tx.txStatus === TxStatus.bridged) {
        const fundsTo = {
          token: rosenChainTokens[0][container.destChain],
          decimalAmount: tx.amount / 1000000000,
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
    const dbResult = await this.db.tx.updateDistributedTxId(
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

  async hasRosenWalletReceivedFunds(): Promise<boolean> {
    throw new Error('Not Implemented');
  }
}
