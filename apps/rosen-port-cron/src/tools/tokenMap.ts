import { TokenMap } from '@rosen-bridge/tokens';
import tokens from '../../tokens.json' assert { type: 'json' };

export const tokenMap = new TokenMap(tokens);
