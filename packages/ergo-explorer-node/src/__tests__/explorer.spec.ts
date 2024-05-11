import { ExplorerAPI } from '../explorer-api';
import { Box } from '../types/explorer.types';

describe('Explorer API', () => {
  it('should get boxes', async () => {
    const explorer = new ExplorerAPI();

    const result: Array<Box> = await explorer.getUnspentBoxesByAddress(
      '9gdrGV6JFKvwcF9ntQyVn7johH8EQMxjrfm8jCzjQ8S3ccZPJEz'
    );
    console.log(result);
    console.log(result[0].additionalRegisters.R4);
  });
});
