import { ErgoExplorerAPI } from '../explorer-api';
import { Box, Transaction } from '../types/explorer.types';

describe('Explorer API', () => {
  it('should get boxes', async () => {
    const explorer = new ErgoExplorerAPI();

    const result: Transaction = await explorer.getTransaction(
      'b94fb7840a8061c7fa4e1bf9917cfb796652605dc5bf4d8411d0476dd17aff37'
    );
    console.log(result.numConfirmations);
  });
});
