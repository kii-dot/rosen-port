const DB_TYPE = {
  uuid: 'uuid',
  varchar: 'varchar',
  timestamp: 'timestampz',
  bool: 'bool',
  int8: 'int8',
  text: 'text',
  container_status: 'container_status',
  tx_status: 'tx_status',
  refund_status: 'refund_status',
};

/**
 * drafted -> Tx is created as a draft
 * unconfirmed -> Payment Tx has been sent but has not been confirmed
 * confirmed -> Payment Tx has confirmed reached wallet
 * bridged -> The tx has been bridged, may or may not have been received
 * sent -> The tx is sent out to the user (COMPLETION for Bridging)
 * refunding -> The UNBRIDGED tx has been instantiated for refunding
 * refund_completed -> The tx has been refunded and will not be bridged
 * temporary_unavailable -> This enum is to be kept for cases where we need
 *                          to alter enum values or for unknown cases
 */
export enum TxStatus {
  drafted = 'drafted',
  unconfirmed = 'unconfirmed',
  confirmed = 'confirmed',
  bridged = 'bridged',
  sent = 'sent',
  refunding = 'refunding',
  refund_completed = 'refund_completed',
  temporary_unavailable = 'temporary_unavailable',
}

/**
 * refund_initiated -> User initiated refund (ServiceFeeTxId entered)
 * refund_service_fee_signed -> User has signed the tx for service fee payment
 * refund_valid -> The refund is confirmed by oracle and is valid
 * refund_in_process -> service fee payment is confirmed, and refund cron job
 *                      starts processing refund
 * refund_processed -> refund of amount sent out, but not confirmed
 * refund_completed -> refund is confirmed (COMPLETION)
 */
export enum RefundStatus {
  refund_initiated = 'refund_initiated',
  refund_service_fee_signed = 'refund_service_fee_signed',
  refund_valid = 'refund_valid',
  refund_in_process = 'refund_in_process',
  refund_processed = 'refund_processed',
  refund_completed = 'refund_completed',
}

/**
 * initiated -> The container has been created
 * filling_in_progress -> The container has at least 1 transaction
 * filled -> The container is filled and ready to be bridged
 * bridged -> The container has been bridged, but may or may not
 *            been received on dest chain
 * fund_distribution_in_progress -> The txs in the bridged container
 *                  is being distributed to the respective dest address
 * funds_distributed -> The funds in the bridged container has been
 *                  distributed. (COMPLETION)
 */
export enum ContainerStatus {
  initiated = 'initiated',
  filling_in_progress = 'filling_in_progress',
  filled = 'filled',
  bridge_tx_sent = 'bridge_tx_sent',
  bridging = 'bridging',
  bridged = 'bridged',
  fund_distribution_in_progress = 'fund_distribution_in_progress',
  funds_distributed = 'fund_distributed',
}

export enum Chain {
  ergo = 0,
  cardano = 1,
  bitcoin = 2,
}

export class Token {
  id: string;
  name: string;
  tokenId: string;
  nativeChain: Chain;

  constructor({
    id,
    name,
    tokenId,
    nativeChain,
  }: {
    id: string;
    name: string;
    tokenId: string;
    nativeChain: Chain;
  }) {
    this.id = id;
    this.name = name;
    this.tokenId = tokenId;
    this.nativeChain = nativeChain;
  }
}

export class Refund {
  id: string;
  createdAt: string;
  txToRefund: Tx;
  container: Container;
  serviceFeeTxId: string;
  status: RefundStatus;
  refundTxId: string;

  constructor({
    id,
    createdAt,
    txToRefund,
    status,
    refundTxId,
    serviceFeeTxId,
    container,
  }: {
    id: string;
    createdAt: string;
    txToRefund: Tx;
    status: RefundStatus;
    refundTxId: string;
    serviceFeeTxId: string;
    container: Container;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.txToRefund = txToRefund;
    this.status = status;
    this.refundTxId = refundTxId;
    this.serviceFeeTxId = serviceFeeTxId;
    this.container = container;
  }
}

export class Wallet {
  chain: string;
  walletAddress: string;

  constructor({
    chain,
    walletAddress,
  }: {
    chain: string;
    walletAddress: string;
  }) {
    this.chain = chain;
    this.walletAddress = walletAddress;
  }
}

export class Container {
  id: string;
  createdAt: string;
  bridgedTime: string;
  bridgedTxId: string;
  sourceChain: string;
  destChain: string;
  tokenType: Token;
  status: ContainerStatus;
  totalAmount: number;

  constructor({
    id,
    createdAt,
    bridgedTime = '',
    bridgedTxId,
    sourceChain,
    destChain,
    tokenType,
    status,
    totalAmount,
  }: {
    id: string;
    createdAt: string;
    bridgedTime: string;
    bridgedTxId: string;
    sourceChain: string;
    destChain: string;
    tokenType: Token;
    status: ContainerStatus;
    totalAmount: number;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.bridgedTime = bridgedTime;
    this.bridgedTxId = bridgedTxId;
    this.sourceChain = sourceChain;
    this.destChain = destChain;
    this.tokenType = tokenType;
    this.status = status;
    this.totalAmount = totalAmount;
  }
}

export class Tx {
  id: string;
  createdAt: string;
  initiatedTxId: string;
  amount: number;
  sourceAddress: string;
  destAddress: string;
  txStatus: TxStatus;
  distributedTxId: string;
  containerId: string;

  constructor({
    id,
    createdAt,
    initiatedTxId,
    amount,
    sourceAddress,
    destAddress,
    txStatus,
    distributedTxId,
    containerId,
  }: {
    id: string;
    createdAt: string;
    initiatedTxId: string;
    amount: number;
    sourceAddress: string;
    destAddress: string;
    txStatus: TxStatus;
    distributedTxId: string;
    containerId: string;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.initiatedTxId = initiatedTxId;
    this.amount = amount;
    this.sourceAddress = sourceAddress;
    this.destAddress = destAddress;
    this.txStatus = txStatus;
    this.distributedTxId = distributedTxId;
    this.containerId = containerId;
  }
}

export class TxWithContainerInfo {
  tx: Tx;
  container: Container;

  constructor({ tx, container }: { tx: Tx; container: Container }) {
    this.tx = tx;
    this.container = container;
  }
}

export class to {
  static container(data: any): Container {
    const tokenType = new Token({
      id: data.token_type.id,
      name: data.token_type.name,
      tokenId: data.token_type.token_id,
      nativeChain: data.token_type.native_Chain,
    });

    return new Container({
      id: data.id,
      createdAt: data.created_at,
      bridgedTime: data.bridged_time,
      bridgedTxId: data.bridged_tx_id,
      sourceChain: data.source_chain,
      destChain: data.dest_chain,
      tokenType: tokenType,
      status: data.status,
      totalAmount: 0,
    });
  }

  static tx(data: any): Tx {
    return new Tx({
      id: data.id,
      createdAt: data.created_at,
      initiatedTxId: data.initiated_tx_id,
      amount: data.amount,
      sourceAddress: data.source_address,
      destAddress: data.dest_address,
      txStatus: data.tx_status,
      distributedTxId: data.distributed_tx_id,
      containerId: data.container_id,
    });
  }

  static refund(data: any): Refund {
    const tx = new Tx({
      id: data.transactions.id,
      createdAt: data.transactions.created_at,
      initiatedTxId: data.transactions.initiated_tx_id,
      amount: data.transactions.amount,
      sourceAddress: data.transactions.source_address,
      destAddress: data.transactions.dest_address,
      txStatus: data.transactions.tx_status,
      distributedTxId: data.transactions.distributed_tx_id,
      containerId: data.transactions.container_id,
    });

    const container = this.container(data.transactions.containers);
    return new Refund({
      id: data.id,
      createdAt: data.created_at,
      txToRefund: tx,
      refundTxId: data.refund_tx_id,
      status: data.status,
      serviceFeeTxId: data.service_fee_tx_id,
      container: container,
    });
  }

  static txWithContainerInfo(data: any): TxWithContainerInfo {
    const tx = new Tx({
      id: data.id,
      createdAt: data.created_at,
      initiatedTxId: data.initiated_tx_id,
      amount: data.amount,
      sourceAddress: data.source_address,
      destAddress: data.dest_address,
      txStatus: data.tx_status,
      distributedTxId: data.distributed_tx_id,
      containerId: data.container_id,
    });

    const container = this.container(data.containers);

    return new TxWithContainerInfo({ tx, container: container });
  }

  static wallet(data: any): Wallet {
    const wallet = new Wallet({
      chain: data.chain.name,
      walletAddress: data.wallet_address,
    });
    return wallet;
  }
}

export const DbConstants = {
  containers: {
    name: 'containers',
    columns: {
      id: {
        name: 'id',
        type: DB_TYPE.uuid,
      },
      created_at: {
        name: 'created_at',
        type: DB_TYPE.timestamp,
      },
      bridged_time: {
        name: 'bridged_time',
        type: DB_TYPE.timestamp,
      },
      source_chain: {
        name: 'source_chain',
        type: DB_TYPE.text,
      },
      dest_chain: {
        name: 'dest_chain',
        type: DB_TYPE.text,
      },
      token_type: {
        name: 'token_type',
        type: DB_TYPE.uuid,
      },
      status: {
        name: 'status',
        type: DB_TYPE.container_status,
      },
    },
  },
  transactions: {
    name: 'transactions',
    columns: {
      id: {
        name: 'id',
        type: DB_TYPE.uuid,
      },
      created_at: {
        name: 'created_at',
        type: DB_TYPE.timestamp,
      },
      initiated_tx_id: {
        name: 'initiated_tx_id',
        type: DB_TYPE.text,
      },
      amount: {
        name: 'amount',
        type: DB_TYPE.text,
      },
      source_address: {
        name: 'source_address',
        type: DB_TYPE.text,
      },
      dest_address: {
        name: 'dest_address',
        type: DB_TYPE.text,
      },
      tx_status: {
        name: 'tx_status',
        type: DB_TYPE.tx_status,
      },
      distributed_tx_id: {
        name: 'distributed_tx_id',
        type: DB_TYPE.text,
      },
      container_id: {
        name: 'container_id',
        type: DB_TYPE.uuid,
      },
    },
  },
  refunds: {
    name: 'refunds',
    columns: {
      id: {
        name: 'id',
        type: DB_TYPE.uuid,
      },
      created_at: {
        name: 'created_at',
        type: DB_TYPE.timestamp,
      },
      tx_to_refund: {
        name: 'tx_to_refund',
        type: DB_TYPE.text,
      },
      refund_tx_id: {
        name: 'refund_tx_id',
        type: DB_TYPE.text,
      },
      service_fee_tx_id: {
        name: 'service_fee_tx_id',
        type: DB_TYPE.text,
      },
      status: {
        name: 'status',
        type: DB_TYPE.refund_status,
      },
    },
  },
  wallet: {
    name: 'rosen_port_wallets',
    columns: {
      id: {
        name: 'id',
        type: DB_TYPE.uuid,
      },
      chain: {
        name: 'chain',
        type: DB_TYPE.int8,
      },
      walletAddress: {
        name: 'wallet_address',
        type: DB_TYPE.text,
      },
    },
  },
};
