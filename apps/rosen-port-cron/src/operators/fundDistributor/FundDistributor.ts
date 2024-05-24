import {
  Container,
  ContainerStatus,
  RosenPortDBClient,
  Tx,
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
import { NotImplementedException } from '@rosen-port/errors';
import { Wallet } from '@rosen-port/db';

export class FundDistributor extends Executor implements IFundDistributor {
  tokenMap: TokenMap;
  container: Container;
  updatedTxId: string;
  db: RosenPortDBClient;
  txs: Tx[];

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

    this.updatedTxId = await this.distributeFunds(this.container, this.txs);

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
    this.txs = await this.getContainerTxs(this.container);
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

    // 2. Check if the wallet has received the funds.
    const isFundsReceived = await this.hasPortWalletReceivedFunds(
      this.container,
      this.txs
    );

    if (!isFundsReceived) {
      throw new Error('Funds not Received');
    }
  }

  async getPortWallet(container: Container): Promise<Wallet> {
    const rosenPortWalletAddress = await this.db.wallet.getWallet(
      container.destChain
    );

    return rosenPortWalletAddress;
  }

  async getContainerTxs(container: Container): Promise<Tx[]> {
    const txs = await this.db.tx.getContainerTxs(this.container.id);
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
    const token = container.tokenType.tokenId;
    const rosenChainTokens = this.tokenMap.search(container.destChain, {
      tokenId: token,
    });

    const rosenPortWalletAddress = await this.getPortWallet(this.container);

    txs.forEach(async (tx) => {
      if (tx.txStatus === TxStatus.bridged) {
        const fundsTo = {
          token: rosenChainTokens[0][container.destChain],
          // @todo kii This decimalAmount is wrong
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

  /**
   * Check to see if Port Wallet Received Funds
   *
   * Check if there is a tx from explorer to wallet from Rosen wallet
   * container.bridgedTxId is updated by the StatusChecker CronJob
   * @todo sangy, help figure out what is the best way for us to check this.
   */
  async hasPortWalletReceivedFunds(
    container: Container,
    txs: Tx[]
  ): Promise<boolean> {
    const totalTokenAmount: number = txs.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      0
    );

    // @ts-ignore
    const network = Networks[container.destChain];

    const bridgedTxId: string = container.bridgedTxId;

    throw new NotImplementedException();
  }
}
