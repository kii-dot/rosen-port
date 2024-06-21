import { ContainerStatus, RefundStatus, TxStatus } from '@rosen-port/db';

/**
 * Interface for the Status Update Cron functionality.
 * This interface defines the responsibilities for updating and checking the statuses of transactions, containers, and refunds.
 */
export interface IPortOracle {
  /** Retrieves the current status of a transaction using its unique identifier. */
  checkTransactionStatus(transactionId: string): TxStatus;

  /** Retrieves the current status of a container using its unique identifier. */
  checkContainerStatus(containerId: string): ContainerStatus;

  /** Retrieves the current status of a refund using its unique identifier. */
  checkRefundStatus(refundId: string): RefundStatus;

  /** Updates the transaction status in the internal database. */
  updateTransactionStatusInDB(transactionId: string, status: TxStatus): void;

  /** Updates the container status in the internal database. */
  updateContainerStatusInDB(containerId: string, status: ContainerStatus): void;

  /** Updates the refund status in the internal database. */
  updateRefundStatusInDB(refundId: string, status: RefundStatus): void;

  /** Handles changes in transaction status by triggering necessary system responses. */
  onTransactionStatusChange(transactionId: string, status: TxStatus): void;

  /** Handles changes in container status by triggering necessary system responses. */
  onContainerStatusChange(containerId: string, status: ContainerStatus): void;

  /** Handles changes in refund status by triggering necessary system responses. */
  onRefundStatusChange(refundId: string, status: RefundStatus): void;
}
