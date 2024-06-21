import { NotImplementedException } from '@rosen-port/errors';
import { Executor } from '../../types/executor';
import { IPortOracle } from './types';
import {
  TxStatus,
  ContainerStatus,
  RefundStatus,
  Container,
  Tx,
} from '@rosen-port/db';

export class PortOracle extends Executor implements IPortOracle {
  checkTransactionStatus(transactionId: string): TxStatus {
    throw new Error('Method not implemented.');
  }
  checkContainerStatus(containerId: string): ContainerStatus {
    throw new Error('Method not implemented.');
  }
  checkRefundStatus(refundId: string): RefundStatus {
    throw new Error('Method not implemented.');
  }
  updateTransactionStatusInDB(transactionId: string, status: TxStatus): void {
    throw new Error('Method not implemented.');
  }
  updateContainerStatusInDB(
    containerId: string,
    status: ContainerStatus
  ): void {
    throw new Error('Method not implemented.');
  }
  updateRefundStatusInDB(refundId: string, status: RefundStatus): void {
    throw new Error('Method not implemented.');
  }
  onTransactionStatusChange(transactionId: string, status: TxStatus): void {
    throw new Error('Method not implemented.');
  }
  onContainerStatusChange(containerId: string, status: ContainerStatus): void {
    throw new Error('Method not implemented.');
  }
  onRefundStatusChange(refundId: string, status: RefundStatus): void {
    throw new Error('Method not implemented.');
  }
  onBeforeExecute(): Promise<void> {
    throw new NotImplementedException();
  }
  onAfterExecute(): Promise<void> {
    throw new NotImplementedException();
  }
  onExecute(): Promise<void> {
    throw new NotImplementedException();
  }

  /**
   * Check to see if Port Wallet Received Funds
   *
   * Check if there is a tx from explorer to wallet from Rosen wallet
   * container.bridgedTxId is updated by the StatusChecker CronJob
   *
   * The Port wallet receive funds when the bridge is completed. Since Rosen
   * is based on addresses (from Rosen-Bridge) sending it to Rosen-Port wallet.
   * Therefore, for us to have confirmation, we will check the Rosen-Port addresses
   * to see if we received funds from Bridge addresses. If we received it, we
   * compare it to the current amount and get it.
   *
   * 1. Get events from Rosen Bridge directly and check the bridge id to get status.
   *
   *
   * // @Todo kii MOVE THIS and implement this
   * ## NOTE: MOVE THIS TO STATUS CHECKER.
   * ## WE WILL STICK TO A DESIGN WHERE THE SECURITY IS CHECKED BY STATUS CHECKER.
   * ## EVERYTHING ELSE WILL BE DEPENDENT ON THAT.
   * ##
   * ## This forces a single responsibility pattern. And allow us to build security
   * ## around the checkers rather than the operators
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
