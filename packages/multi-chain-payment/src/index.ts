// Multi Chain Payment
// This sdk is used for multi-purpose payment
// It allows users to input a value (dollar or
// token amount) and it should create a payment
// transaction for users. Either through wallet

import { MCPWallet, MultiChainPayment } from './native';

// or through providing a QR code.
export { MultiChainPayment, MCPWallet };
