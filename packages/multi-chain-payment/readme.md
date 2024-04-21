# Multi Chain Payment

This sdk is used for multi-purpose payment
It allows users to input a value (dollar or token amount) and it should create a payment transaction for users on the specified chain. Either through browser wallet or through providing a QR code.

## Components

### UI
This sdk provides a simple out of the box UI. A dropdown for the chain, and the currency (USD etc) amount or crypto amount as input and it will call the browser wallet, or provide a QR code for user.
```javascript
import {MultiChainPaymentUI} from "multi-chain-payment"

export class WalletSign = () => {
    const [amount, setAmount] = setState(0)
    const [chain, setChain] = setState("bitcoin")
    return (
        <div>
            <MultiChainPaymentUI
                amount={amount}
                chain={chain}
                onSubmitClicked={(txBytes) => {
                    // sign txBytes
                }}
                asQRCode={false} // Decides on whether a QR code is shown instead
            />
        </div>
    )
}
```

### Code
This sdk also provides a native code implementation for user to implement their own UI so that they can call our functions. Or for users to utilize the code to do backend payment. 
```javascript
import {MultiChainPayment, MCPWallet} from "multi-chain-payment"
const walletAddresses = {
    bitcoin: "test-bitcoin-wallet-address",
    ergo: "test-ergo-wallet-address",
    cardano: "test-cardano-wallet-address"
}
const mcp = new MultiChainPayment({
    paymentAddresses: walletAddresses
})

const amountInUSD = 10000 // $100
const paymentTxForBtc = mcp.createPaymentTo({
    chain: "bitcoin",
    amountInUSD
})

const btcWallet = MCPWallet.create({
    chain: "bitcoin",
    mnemonic: "test-mnemonic"
})

btcWallet.signAndSubmit(paymentTxForBtc)
```