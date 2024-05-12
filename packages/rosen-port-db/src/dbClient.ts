import { SupabaseClient, createClient } from '@supabase/supabase-js';
import {
  Container,
  ContainerStatus,
  DbConstants,
  Refund,
  RefundStatus,
  Tx,
  TxStatus,
  TxWithContainerInfo,
  Wallet,
  to,
} from './dbConstants';

enum Chain {
  ergo = 0,
  cardano = 1,
  bitcoin = 2,
}

abstract class DB {
  supabaseClient!: SupabaseClient;

  fetchData = async (
    table: string,
    select: string,
    eqCol: string,
    eqTo: string
  ) => {
    const { data, error } = await this.supabaseClient
      .from(table)
      .select(select)
      .eq(eqCol, eqTo);

    return { data, error };
  };

  insertData = async (table: string, value: object) => {
    const { data, error } = await this.supabaseClient
      .from(table)
      .insert(value)
      .select();

    return { data, error };
  };

  updateData = async (
    table: string,
    value: object,
    eqCol: string,
    eqTo: string
  ) => {
    const { data, error } = await this.supabaseClient
      .from(table)
      .update(value)
      .eq(eqCol, eqTo)
      .select();

    return { data, error };
  };
}

class WalletsDB extends DB {
  getWalletQuery: string = `
        id,
        wallet_address,
        chain (name)
        `;
  constructor(supabaseClient: SupabaseClient) {
    super();
    this.supabaseClient = supabaseClient;
  }

  getWallets = async (): Promise<Wallet[]> => {
    const { data, error } = await this.supabaseClient
      .from(DbConstants.wallet.name)
      .select(this.getWalletQuery);

    if (data !== null) {
      return data.map((result) => {
        return to.wallet(result);
      });
    }

    throw error;
  };

  getWallet = async (chain: string): Promise<Wallet> => {
    var chainId = 0;
    switch (chain) {
      case 'ergo':
        chainId = Chain.ergo;
        break;
      case 'cardano':
        chainId = Chain.cardano;
        break;
      case 'bitcoin':
        chainId = Chain.bitcoin;
        break;
      default:
        chainId = 0;
        break;
    }

    const { data, error } = await this.supabaseClient
      .from(DbConstants.wallet.name)
      .select(this.getWalletQuery)
      .eq(DbConstants.wallet.columns.chain.name, chainId);

    if (data !== null) {
      return to.wallet(data[0]);
    }

    throw error;
  };
}

class ContainerDB extends DB {
  getContainerQuery: string = `
        id,
        created_at,
        bridged_time,
        source_chain,
        dest_chain,
        status,
        token_type ("*")
        `;

  constructor(supabaseClient: SupabaseClient) {
    super();
    this.supabaseClient = supabaseClient;
  }

  getContainers = async (
    limit: number = 100,
    index: number = 0
  ): Promise<Container[]> => {
    const { data, error } = await this.supabaseClient
      .from(DbConstants.containers.name)
      .select(this.getContainerQuery)
      .range(index, index + limit);

    if (data !== null) {
      return data.map((result) => {
        return to.container(result);
      });
    }

    throw error;
  };

  getContainersViaStatus = async (
    status: ContainerStatus,
    limit: number = 100,
    index: number = 0
  ): Promise<Container[]> => {
    const { data, error } = await this.supabaseClient
      .from(DbConstants.containers.name)
      .select(this.getContainerQuery)
      .eq(DbConstants.containers.columns.status.name, status)
      .range(index, index + limit);

    if (data !== null) {
      return data.map((result) => {
        return to.container(result);
      });
    }

    throw error;
  };

  getContainer = async (containerId: string): Promise<Container> => {
    const { data, error } = await this.supabaseClient
      .from(DbConstants.containers.name)
      .select(this.getContainerQuery)
      .eq(DbConstants.containers.columns.id.name, containerId);

    if (data !== null) {
      return to.container(data[0]);
    }

    throw error;
  };

  getContainerViaChain = async (
    sourceChain: string,
    destChain: string,
    tokenType: string,
    status: ContainerStatus
  ): Promise<Container[]> => {
    var andStatement = {
      [DbConstants.containers.columns.source_chain.name]: sourceChain,
      [DbConstants.containers.columns.dest_chain.name]: destChain,
      [DbConstants.containers.columns.token_type.name]: tokenType,
      [DbConstants.containers.columns.status.name]: status,
    };
    const { data, error } = await this.supabaseClient
      .from(DbConstants.containers.name)
      .select(this.getContainerQuery)
      .match(andStatement);

    if (data !== null) {
      return data.map((result) => {
        return to.container(result);
      });
    }

    throw error;
  };

  /**
   * Create container and set status to
   * @param sourceChain
   * @param destChain
   * @param tokenType
   * @param status
   * @returns
   */
  createContainer = async (
    sourceChain: string,
    destChain: string,
    tokenType: string
  ): Promise<Container> => {
    const { data, error } = await this.insertData(DbConstants.containers.name, {
      [DbConstants.containers.columns.source_chain.name]: sourceChain,
      [DbConstants.containers.columns.dest_chain.name]: destChain,
      [DbConstants.containers.columns.token_type.name]: tokenType,
      [DbConstants.containers.columns.status.name]: ContainerStatus.initiated,
    });

    if (data !== null) {
      return to.container(data[0]);
    }

    throw error;
  };
}

class TxDB extends DB {
  constructor(supabaseClient: SupabaseClient) {
    super();
    this.supabaseClient = supabaseClient;
  }

  getTx = async (txId: string): Promise<Tx> => {
    const { data, error } = await this.supabaseClient
      .from(DbConstants.transactions.name)
      .select()
      .eq(DbConstants.transactions.columns.initiated_tx_id.name, txId);

    if (data !== null) {
      return to.tx(data[0]);
    }

    throw error;
  };

  getUserTxs = async (walletAddress: string): Promise<TxWithContainerInfo> => {
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
        distributed_tx_id,
        containers (
          status,
          id, 
          created_at,
          bridged_time,
          source_chain,
          dest_chain,
          token_type (id, name, token_id, native_chain)
        )
      `
      )
      .or(
        `${DbConstants.transactions.columns.source_address.name}.eq.${walletAddress}, ${DbConstants.transactions.columns.dest_address.name}.eq.${walletAddress}`
      );

    if (data !== null) {
      return to.txWithContainerInfo(data[0]);
    }

    throw error;
  };

  getContainerTxs = async (containerId: string): Promise<Tx[]> => {
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
        distributed_tx_id,
        container_id
      `
      )
      .eq(DbConstants.transactions.columns.container_id.name, containerId);

    if (data !== null && error == null) {
      const txs = data.map((result) => {
        return to.tx(result);
      });

      return txs;
    }

    throw error;
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
  createTx = async (
    txId: string,
    amount: number,
    sourceAddress: string,
    destAddress: string,
    containerId: string
  ): Promise<Tx> => {
    const { data, error } = await this.insertData(
      DbConstants.transactions.name,
      {
        [DbConstants.transactions.columns.initiated_tx_id.name]: txId,
        [DbConstants.transactions.columns.amount.name]: amount.toString(),
        [DbConstants.transactions.columns.source_address.name]: sourceAddress,
        [DbConstants.transactions.columns.dest_address.name]: destAddress,
        [DbConstants.transactions.columns.container_id.name]: containerId,
        [DbConstants.transactions.columns.tx_status.name]: TxStatus.drafted,
      }
    );

    if (data !== null) {
      return to.tx(data[0]);
    }

    throw error;
  };

  /**
   * Update tx status
   * @param txId
   * @param txStatus
   * @returns
   */
  updateTxStatus = async (txId: string, txStatus: TxStatus): Promise<Tx> => {
    const { data, error } = await this.updateData(
      DbConstants.transactions.name,
      {
        [DbConstants.transactions.columns.tx_status.name]: txStatus,
      },
      DbConstants.transactions.columns.initiated_tx_id.name,
      txId
    );

    if (data !== null) {
      return to.tx(data[0]);
    }

    throw error;
  };
}

class RefundsDB extends DB {
  constructor(supabaseClient: SupabaseClient) {
    super();
    this.supabaseClient = supabaseClient;
  }

  /**
   * Creates a new refund row with status set to refund_initiated
   * @param txIdToRefund
   * @returns
   */
  createRefund = async (
    txIdToRefund: string,
    serviceFeeTxId: string
  ): Promise<Refund> => {
    const { data, error } = await this.insertData(DbConstants.refunds.name, {
      [DbConstants.refunds.columns.tx_id_to_refund.name]: txIdToRefund,
      [DbConstants.refunds.columns.service_fee_tx_id.name]: serviceFeeTxId,
      [DbConstants.refunds.columns.status.name]: RefundStatus.refund_initiated,
    });

    if (data !== null) {
      return to.refund(data[0]);
    }

    throw error;
  };

  /**
   * Update service fee tx id
   * @param txIdToRefund
   * @param serviceFeeTxId
   * @returns
   */
  updateServiceFeeTxId = async (
    txIdToRefund: string,
    serviceFeeTxId: string
  ): Promise<Refund> => {
    const { data, error } = await this.updateData(
      DbConstants.refunds.name,
      {
        [DbConstants.refunds.columns.service_fee_tx_id.name]: serviceFeeTxId,
      },
      DbConstants.refunds.columns.tx_id_to_refund.name,
      txIdToRefund
    );

    if (data !== null) {
      return to.refund(data[0]);
    }

    throw error;
  };

  /**
   * Update refund tx id
   * @param txIdToRefund
   * @param refundTxId
   * @returns
   */
  updateRefundTxId = async (
    txIdToRefund: string,
    refundTxId: string
  ): Promise<Refund> => {
    const { data, error } = await this.updateData(
      DbConstants.refunds.name,
      {
        [DbConstants.refunds.columns.refund_tx_id.name]: refundTxId,
      },
      DbConstants.refunds.columns.tx_id_to_refund.name,
      txIdToRefund
    );

    if (data !== null) {
      return to.refund(data[0]);
    }

    throw error;
  };

  /**
   * Update refund tx status
   * @param txIdToRefund
   * @param txStatus
   * @returns
   */
  updateRefundStatus = async (
    txIdToRefund: string,
    refundStatus: RefundStatus
  ): Promise<Refund> => {
    const { data, error } = await this.updateData(
      DbConstants.refunds.name,
      {
        [DbConstants.refunds.columns.status.name]: refundStatus,
      },
      DbConstants.refunds.columns.tx_id_to_refund.name,
      txIdToRefund
    );

    if (data !== null) {
      return to.refund(data[0]);
    }

    throw error;
  };
}

export class DBClient {
  supabaseClient: SupabaseClient;
  container: ContainerDB;
  tx: TxDB;
  refund: RefundsDB;
  wallet: WalletsDB;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
    this.container = new ContainerDB(this.supabaseClient);
    this.tx = new TxDB(this.supabaseClient);
    this.refund = new RefundsDB(this.supabaseClient);
    this.wallet = new WalletsDB(this.supabaseClient);
  }
}
