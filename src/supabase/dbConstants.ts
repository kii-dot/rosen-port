const DB_TYPE = {
  uuid: 'uuid',
  varchar: 'varchar',
  timestamp: 'timestampz',
};

export const DbConstants = {
  handles: {
    name: 'handles',
    columns: {
      id: {
        name: 'id',
        type: DB_TYPE.uuid,
      },
      handle: {
        name: 'handle',
        type: DB_TYPE.varchar,
      },
      created_at: {
        name: 'created_at',
        type: DB_TYPE.timestamp,
      },
    },
  },
};
