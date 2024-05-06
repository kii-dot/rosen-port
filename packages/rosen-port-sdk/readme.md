# Rosen Port SDK

An sdk to be used in rosen-port-ui to carry out payments.

## Package utilized

This sdk utilizes

- multi-chain-payment: for payment tx generation and signing
- rosen-sdk: to calculate transfer fee
- rosen-port-db: pulls wallet

## Developer Experience and Usage Flow

Developer use this sdk to:

1. Create multi-chain payment txs to sign that is sent to Rosen-Port wallets (wallets retrieved via rosen-port get-wallets backend APIs)
2. Get container infos (by calling get-containers/get-container backend APIs)

## Example usage

### Payment

```javascript
const rosenPortSDK = new RosenPortSDK();
const sourceChain = 'bitcoin';
const destChain = 'ergo';
const amount = 10000;
const token = RosenChainToken.Ergo;
const sourceAddress = 'test-source-address';
const destAddress = 'test-dest-address';
const fee = rosenPortSDK.calculateFee({
  sourceChain,
  destChain,
  amount,
  sourceAddress,
  destAddress,
});
// fee : {
//      total: number
//      bridgeFee: number
// }

const txToBitcoinForSign = rosenPortSDK.bridge({
  sourceChain,
  destChain,
  amount,
  token,
  sourceAddress,
  destAddress,
  browserWallet: true,
});
// sendTxToBitcoin returns a tx bytes that user can sign
// with browser wallet or if false, a tx that can be
// sign with native-code wallet
```

### Refund

Create a refund service fee tx for user to sign

```javascript
const rosenPortSDK = new RosenPortSDK();
const txId = 'test-tx-id';
const refundTxForSign = rosenPortSDK.refundTx({
  txId,
});
// Provides a refund tx to sign
```

### Get Info

```javascript
const rosenPortSDK = new RosenPortSDK();
const containersData = rosenPortSDK.getContainers({
  limit: 10,
  index: 0,
});
// Return list of container data and all txs associated with it
// Returns Container[]

const containerId = 'test-id';
const containerData = rosenPortSDK.getContainer({
  id: containerId,
});
// Return container data and all txs associated with it
// Returns {
//  Container
//  Tx[]
// }

const walletAddress = 'test-wallet-add';
const walletTxs = rosenPortSDK.getWalletTxs({
  walletAddress: walletAddress,
});
// Returns {
//  Tx[]
// }
```
