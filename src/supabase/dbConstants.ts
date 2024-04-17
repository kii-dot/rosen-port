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
  drafted,
  unconfirmed,
  confirmed,
  bridged,
  sent,
  refund_initiated,
  refund_in_process,
  refund_processed,
  refund_verified,
}

export enum ContainerStatus {
  initiated,
  filling_in_progress,
  filled,
  bridged,
  fund_distribution_in_progress,
  funds_distributed,
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
