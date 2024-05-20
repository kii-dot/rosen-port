# Rosen-Port Cron Job

The rosen-port cron job is used to finalize refunds and bridging txs.

## Bridge Txs

The API pulls containers that have not been sent and calculates the amount filled. If the containers satisfy the amount of fulfillment, then the container is bridge over to the other chain.

## Refund Txs

The API checks for txs that has refunds initiated. After retrieving the list of txs with refunds initiated, it checks chain-explorers to verify that the service fee has been paid and that the initial tx was completed, and there were not any refund txs that was created. (For example, what if a user sent multiple refund tx for one tx). If the tx has not been refunded, and service fee has been paid, the API refund the amount back to source wallet address.

### Edge Cases

1. How do we prevent a refunded refund's status from being turned back to pre-refund, thus causing us to refund money back to user.
