import { Container, ContainerStatus, Tx } from '@rosen-port/db';

export interface IPortBridgerStoreClient {
  getContainerTxs(containerId: string): Promise<Tx[]>;
  updateContainerStatus(
    containerId: string,
    containerStatus: ContainerStatus
  ): Promise<Container>;
}
