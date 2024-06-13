import { NotImplementedException } from '@rosen-port/errors';
import { Executor } from '../../types/executor';
import { IStatusChecker } from './types';
import { TxStatus, ContainerStatus, RefundStatus } from '@rosen-port/db';

export class StatusChecker extends Executor implements IStatusChecker {
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
}
