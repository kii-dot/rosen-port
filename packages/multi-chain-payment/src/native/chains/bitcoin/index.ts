import { RosenChainToken } from '@rosen-bridge/tokens';
import { IChainTx } from '../../../types/ChainTxs';
import { validateDecimalPlaces } from '@rosen-ui/utils';
import { convertNumberToBigint } from '../ergo';
import { AddressPurpose, AddressType, BitcoinNetworkType } from 'sats-connect';

export class BitcoinChainTx implements IChainTx {
  async connect(): Promise<boolean> {
    return true;
  }

  async generateUnsignedTransferTx(
    token: RosenChainToken,
    decimalAmount: number,
    toAddress: string
  ): Promise<any> {
    // validateDecimalPlaces(decimalAmount, token.decimals);
    // const amount = convertNumberToBigint(decimalAmount * 10 ** token.decimals);
    // const userAddress: string = await new Promise((resolve, reject) => {
    //   getXdefiWallet().api.getAddress({
    //     payload: {
    //       message: '',
    //       network: {
    //         type: BitcoinNetworkType.Mainnet,
    //       },
    //       purposes: [AddressPurpose.Payment],
    //     },
    //     onFinish: ({ addresses }) => {
    //       const segwitPaymentAddresses = addresses.filter(
    //         (address) =>
    //           address.purpose === AddressPurpose.Payment &&
    //           address.addressType === AddressType.p2wpkh
    //       );
    //       if (segwitPaymentAddresses.length > 0)
    //         resolve(segwitPaymentAddresses[0].address);
    //       reject();
    //     },
    //     onCancel: () => {
    //       reject();
    //     },
    //   });
    // });
    // const opReturnData = generateOpReturnData(
    //   toChain,
    //   toAddress,
    //   networkFee.toString(),
    //   bridgeFee.toString()
    // );
    // const psbtData = await generateUnsignedTx(
    //   toAddress,
    //   userAddress,
    //   amount,
    //   opReturnData
    // );
    // return psbtData;
  }
}
