import { TokenMap } from '@rosen-bridge/tokens';
import tokens from '../assets/rosenTokens.json' assert { type: 'json' };

export const tokenMap = new TokenMap(tokens);
