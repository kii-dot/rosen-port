import { IToken } from '#/types/chains';
import ergoTokenIcon from '#/assets/tokenIcon/ergoToken.svg';
import btcTokenIcon from '#/assets/tokenIcon/btcToken.svg';
import sigUSDTokenIcon from '#/assets/tokenIcon/sigUSDToken.svg';

export const Tokens: Array<IToken> = [
  {
    id: 'erg',
    name: 'ERG',
    icon: ergoTokenIcon,
  },
  {
    id: 'sigusd',
    name: 'SigUSD',
    icon: sigUSDTokenIcon,
  },
];
