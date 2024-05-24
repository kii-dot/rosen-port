import { RosenSDK } from '../RosenSDK'; // Adjust the path based on your structure
import { FEE_CONFIG_TOKEN_ID } from '../constants';

describe('RosenSDK', () => {
  it('should correctly store and return its configuration', async () => {
    const networkConfig = {
      CardanoExplorerAPI: 'https://api.koios.rest/api/v1',
      ErgoExplorerAPI: 'https://api.ergoplatform.com',
      BitcoinExplorerAPI: '',
    };

    const sdkConfig = {
      FeeConfigTokenId: FEE_CONFIG_TOKEN_ID,
      NetworkConfig: networkConfig,
    };
    const rsnTokenId =
      '8b08cdd5449a9592a9e79711d7d79249d7a03c535d17efaee83e216e80a44c4b';

    const sdk = new RosenSDK(sdkConfig);

    expect(sdk.getConfig()).toEqual(sdkConfig);
    const fee = await sdk.calculateTransferFee('ergo', rsnTokenId, 0);
    console.log(fee);
  });
});
