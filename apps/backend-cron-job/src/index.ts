import * as cron from "node-cron"
import { dbClient } from "./supabase";

/**
 * Change this to 30 minutes
 */
cron.schedule('*/1 * * * *', async () => {
  // Run a runner where it Bridge
  // 1. Checks containers that are initiated on whether the amount is full. 
  // 2a. If the amount is not filled -> sleep and wait
  // 2b. If the amount is filled -> send it to Rosen to bridge
  // 3. Update status of the containers
  const { data, error } = await dbClient.container.getContainers(100, 0);
  console.log(data);

  // Run a runner where it Refunds
  // 1. Check for Tx that needs to be refunded
  // 2. Check to see if the refund-fee has been confirmed
  // 3. Send funds from Rosen-port wallet to source wallet.
});