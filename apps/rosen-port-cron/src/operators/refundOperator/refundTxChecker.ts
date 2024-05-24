import {
  ergoPortWallet,
  ergoRefundServiceFee,
} from '../../constants/feeConstants';
import { ExplorersFactory } from '../../tools/explorer';

export class RefundTxChecker {
  static async check(
    serviceFeeTxId: string,
    network: string
  ): Promise<boolean> {
    switch (network) {
      case 'ergo':
        return await this.ergoNetworkCheck(serviceFeeTxId);
      default:
        return false;
    }
  }

  static async ergoNetworkCheck(serviceFeeTxId: string): Promise<boolean> {
    const explorer = ExplorersFactory.getExplorers('ergo');
    const transaction = await explorer.getTransaction(serviceFeeTxId);
    if (
      transaction !== null &&
      transaction.numConfirmations > 3 &&
      transaction.outputs[0].value >= ergoRefundServiceFee &&
      transaction.outputs[0].address != ergoPortWallet
    ) {
      return true;
    } else {
      return false;
    }
  }
}
