import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ContainerStatus, DbConstants, TxStatus } from './dbConstants';

abstract class DB {
  supabaseClient!: SupabaseClient;

  fetchData = async (table: string, select: string, eqCol: string, eqTo: string) => {
    const { data, error } = await this.supabaseClient.from(table).select(select).eq(eqCol, eqTo);

    return { data, error };
  };

  insertData = async (table: string, value: object) => {
    const { data, error } = await this.supabaseClient.from(table).insert(value).select();

    return { data, error };
  };

  updateData = async (table: string, value: object, eqCol: string, eqTo: string) => {
    const { data, error } = await this.supabaseClient.from(table).update(value).eq(eqCol, eqTo).select();

    return { data, error };
  };
}

class ContainerDB extends DB {
  constructor(supabaseClient: SupabaseClient) {
    super();
    this.supabaseClient = supabaseClient;
  }

  getContainers = async (limit: number, index: number) => {
    const { data, error } = await this.supabaseClient
      .from(DbConstants.containers.name)
      .select()
      .range(index, index + limit);

    return { data, error };
  };

  getContainer = async (containerId: string) => {
    const { data, error } = await this.fetchData(
      DbConstants.containers.name,
      '*',
      DbConstants.containers.columns.id.name,
      containerId,
    );

    return { data, error };
  };

  getContainerViaChain = async (sourceChain: string, destChain: string, tokenType: string, status: ContainerStatus) => {
    const { data, error } = await this.supabaseClient
      .from(DbConstants.transactions.name)
      .select('*')
      .or(
        `${DbConstants.containers.columns.source_chain.name}.eq.${sourceChain}, 
        ${DbConstants.containers.columns.dest_chain.name}.eq.${destChain},
        ${DbConstants.containers.columns.token_type.name}.eq.${tokenType},
        ${DbConstants.containers.columns.status.name}.eq.${status},
        `,
      );

    return { data, error };
  };

  /**
   * Create container and set status to
   * @param sourceChain
   * @param destChain
   * @param tokenType
   * @param status
   * @returns
   */
  createContainer = async (sourceChain: string, destChain: string, tokenType: string) => {
    const { data, error } = await this.insertData(DbConstants.containers.name, {
      [DbConstants.containers.columns.source_chain.name]: sourceChain,
      [DbConstants.containers.columns.dest_chain.name]: destChain,
      [DbConstants.containers.columns.token_type.name]: tokenType,
      [DbConstants.containers.columns.status.name]: ContainerStatus.initiated,
    });

    return { data, error };
  };
}

class TxDB extends DB {
  constructor(supabaseClient: SupabaseClient) {
    super();
    this.supabaseClient = supabaseClient;
  }

  getUserTxs = async (walletAddress: string) => {
    const { data, error } = await this.supabaseClient
      .from(DbConstants.transactions.name)
      .select(
        `
        id,
        created_at,
        initiated_tx_id,
        amount,
        source_address,
        dest_address,
        tx_status,
        refund_tx_id,
        distributed_tx_id,
        containers (source_chain, dest_chain, token_type (name, native_chain))
      `,
      )
      .or(
        `${DbConstants.transactions.columns.source_address.name}.eq.${walletAddress}, ${DbConstants.transactions.columns.dest_address.name}.eq.${walletAddress}`,
      );

    return { data, error };
  };

  /**
   * Creates a new Tx row with status set to unconfirmed
   * @param txId
   * @param amount
   * @param sourceAddress
   * @param destAddress
   * @param containerId
   * @returns
   */
  createTx = async (txId: string, amount: number, sourceAddress: string, destAddress: string, containerId: string) => {
    const { data, error } = await this.insertData(DbConstants.transactions.name, {
      [DbConstants.transactions.columns.initiated_tx_id.name]: txId,
      [DbConstants.transactions.columns.amount.name]: amount.toString(),
      [DbConstants.transactions.columns.source_address.name]: sourceAddress,
      [DbConstants.transactions.columns.dest_address.name]: destAddress,
      [DbConstants.transactions.columns.container_id.name]: containerId,
      [DbConstants.transactions.columns.tx_status.name]: TxStatus.drafted,
    });

    return { data, error };
  };

  /**
   * Update tx status
   * @param txId
   * @param txStatus
   * @returns
   */
  updateTxStatus = async (txId: string, txStatus: TxStatus) => {
    const { data, error } = await this.updateData(
      DbConstants.transactions.name,
      {
        [DbConstants.transactions.columns.tx_status.name]: txStatus,
      },
      DbConstants.transactions.columns.initiated_tx_id.name,
      txId,
    );

    return { data, error };
  };
}

export class DBClient {
  supabaseClient: SupabaseClient;
  container: ContainerDB;
  tx: TxDB;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
    this.container = new ContainerDB(this.supabaseClient);
    this.tx = new TxDB(this.supabaseClient);
  }
}
