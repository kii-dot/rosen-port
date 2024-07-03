import fs from 'fs';
import path from 'path';
import { root } from '#/server/root';

export const tokensMap = JSON.parse(
  fs.readFileSync(path.resolve(root + '/src/configs/tokensMap.json'), {
    encoding: 'utf-8',
  }),
);
