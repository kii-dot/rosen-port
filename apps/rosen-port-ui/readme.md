# Todo

1st stage: Bridge

1. Create UI for bridging. Basically copy Rosen
2. Use Rosen-sdk to get data
3. After sending tx, commit data to supabase
4. use supabase to check and verify whether we received funds.

2nd stage: Containers

1. Design the container to take up to 2000 worth of funds.
2. Container will check against total funds.
3. Create a container with Source, Destination, ContainerID, Token, Token Amount, Status
4. Create CRON job that uses rosen-sdk to transfer token automatically.
