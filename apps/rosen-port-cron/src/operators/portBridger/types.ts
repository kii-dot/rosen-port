import { Container } from '@rosen-port/db';

/**
 * Interface for the tool to bridge containers via rosen
 */
export interface IPortBridger {
  /**
   * Checks to see if a container has its minimum value filled.
   * Returns the value 0 or 1. Where 1 equals 100%
   *
   * @param containerId The containerId to be checked
   * @returns whether the containerId has been filled up to 100%
   */
  isContainerFilled: (container: Container) => Promise<boolean>;

  /**
   * Bridges a container via rosenPort. All info are captured in db.
   * Checks to see if container is filled first. If Container is not
   * filled, it logs a message and then wait till next cron job run.
   *
   * @param containerId ContainerId of container to be bridged
   * @returns boolean determining whether the bridging was successful
   */
  bridgeContainer: (container: Container) => Promise<string>;

  /**
   * Update
   * - Bridge Status
   * - Bridged Time
   * - Bridge Tx Id
   * @param containerId Id of container
   * @returns whether the db was updated
   */
  updateContainerStatus: (containerId: string) => Promise<boolean>;
}
