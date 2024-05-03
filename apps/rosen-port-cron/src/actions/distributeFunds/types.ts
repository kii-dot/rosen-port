/**
 * Interface for the tool to distribute funds
 */
interface FundDistributer {
    /**
     * Checks the DB and the explorer to identify whether
     * a container has been bridged.
     * 
     * @param containerId Id of container to be checked
     * @returns boolean, true represent bridged, false represents
     *          unbridged
     */
    checkContainerBridged: (containerId: string) => boolean

    /**
     * Distributes funds that have been bridged.
     * Each tx that are distributed are updated in the DB.
     * 
     * @param containerId Id of container to be distributed
     * @returns boolean, true represents distributed, false
     *          represents failure in distribution.
     */
    distributeFunds: (containerId: string) => boolean

    /**
     * Updates the tx status of the tx with the txId in db
     * to distributed
     * 
     * @param txId Id of Tx that has been distributed
     * @returns boolean, true represents updated, false
     *          represents failure to update db.
     */
    updateDistributedTx: (txId: string) => boolean
}