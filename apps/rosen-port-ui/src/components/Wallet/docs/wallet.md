# Blockchain Wallet

This documentation describes the usage of a wallet, the design and implementation of it.

## Usage

The wallet is a core element within a decentralized application (dApps). It is used to retrieve information of the wallets, like address, tokens etc, and is used for interactions on the blockchain, sending tokens to other wallets or contracts through signing of the txs. To simplify this, we can say that a wallet provides this 2 functionality:

1. Information of wallet (Token balances)
2. Identity (Wallet addresses)
3. Interaction with blockchain (sign and submit)

The functionality is generic, yet usage can be as wide as your creativity allows.

## Design

In our design, we would like to focus on the ultimate experience for both users and developers.

### Experience

#### Users

Users of the dApp should experience:

1. 0 confusion on connecting and the wallet they're using
2. 0 knowledge on signing and submitting (Signing and submitting should just work out of the box)
3. Full clarity on their wallet information

#### Developers

Developers of this component should:

1. Have components out of the box with minimal coding
2. Ability to change the design of each components
3. Simple API calls to wallet functionality like Sign and Submit
4. Simple API calls to retrieve wallet information (addresses and token balances)
5. Multi-Network or Single-Network as an option

### Market Research
