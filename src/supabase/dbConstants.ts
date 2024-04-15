const DB_TYPE = {
  uuid: 'uuid',
  varchar: 'varchar',
  timestamp: 'timestampz',
  bool: 'bool',
};

export const DbConstants = {
  users: {
    name: 'users',
    columns: {
      id: {
        name: 'id',
        type: DB_TYPE.uuid,
      },
      email: {
        name: 'email',
        type: DB_TYPE.varchar,
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
  stripeAccount: {
    name: 'stripe_account',
    columns: {
      id: {
        name: 'id',
        type: DB_TYPE.uuid,
      },
      user_id: {
        name: 'user_id',
        type: DB_TYPE.uuid,
      },
      account_id: {
        name: 'account_id',
        type: DB_TYPE.varchar,
      },
      onboarded: {
        name: 'onboarded',
        type: DB_TYPE.bool,
      },
    },
  },
};
