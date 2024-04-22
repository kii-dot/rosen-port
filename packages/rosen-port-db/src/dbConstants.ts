const DB_TYPE = {
  uuid: 'uuid',
  varchar: 'varchar',
  timestamp: 'timestampz',
  bool: 'bool',
  text: 'text',
  container_status: 'container_status',
  tx_status: 'tx_status',
};

export enum TxStatus {
  drafted = 'drafted',
  unconfirmed = 'unconfirmed',
  confirmed = 'confirmed',
  bridged = 'bridged',
  sent = 'sent',
  refund_initiated = 'refund_initiated',
  refund_in_process = 'refund_in_process',
  refund_processed = 'refund_processed',
  refund_verified = 'refund_verified',
}

export enum ContainerStatus {
  initiated = 'initiated',
  filling_in_progress = 'filling_in_progress',
  filled = 'filled',
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

export class Container {
  id: string;
  createdAt: string;
  bridgedTime: string;
  sourceChain: string;
  destChain: string;
  tokenType: Token;
  status: ContainerStatus;
  totalAmount: number;

  constructor({
    id,
    createdAt,
    bridgedTime = '',
    sourceChain,
    destChain,
    tokenType,
    status,
    totalAmount,
  }: {
    id: string;
    createdAt: string;
    bridgedTime: string;
    sourceChain: string;
    destChain: string;
    tokenType: Token;
    status: ContainerStatus;
    totalAmount: number;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.bridgedTime = bridgedTime;
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
  refundTxId: string;
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
    refundTxId,
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
    refundTxId: string;
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
    this.refundTxId = refundTxId;
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
      refundTxId: data.refund_tx_id,
      distributedTxId: data.distributed_tx_id,
      containerId: data.container_id,
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
      refundTxId: data.refund_tx_id,
      distributedTxId: data.distributed_tx_id,
      containerId: data.container_id,
    });

    const tokenType = new Token({
      id: data.container.id,
      name: data.container.name,
      tokenId: data.container.token_id,
      nativeChain: data.container.native_chain,
    });

    const container = this.container(data.container);

    return new TxWithContainerInfo({ tx, container: container });
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
        type: DB_TYPE.varchar,
      },
      dest_chain: {
        name: 'dest_chain',
        type: DB_TYPE.varchar,
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
        type: DB_TYPE.varchar,
      },
      amount: {
        name: 'amount',
        type: DB_TYPE.text,
      },
      source_address: {
        name: 'source_address',
        type: DB_TYPE.varchar,
      },
      dest_address: {
        name: 'dest_address',
        type: DB_TYPE.varchar,
      },
      tx_status: {
        name: 'tx_status',
        type: DB_TYPE.tx_status,
      },
      refund_tx_id: {
        name: 'refund_tx_id',
        type: DB_TYPE.varchar,
      },
      distributed_tx_id: {
        name: 'distributed_tx_id',
        type: DB_TYPE.varchar,
      },
      container_id: {
        name: 'container_id',
        type: DB_TYPE.uuid,
      },
    },
  },
};
