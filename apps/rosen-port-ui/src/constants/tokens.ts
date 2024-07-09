import { IToken } from '#/types/chains';
import ergoTokenIcon from '#/assets/tokenIcon/ergoToken.svg';
import btcTokenIcon from '#/assets/tokenIcon/btcToken.svg';
import sigUSDTokenIcon from '#/assets/tokenIcon/sigUSDToken.svg';

export const ErgToken: IToken = {
  id: 'erg',
  name: 'ERG',
  icon: ergoTokenIcon,
};

export const SigUSDToken: IToken = {
  id: 'sigusd',
  name: 'SigUSD',
  icon: sigUSDTokenIcon,
};

export const Tokens: Array<IToken> = [ErgToken, SigUSDToken];
