import { IChain } from '#/types/chains';
import ergoIcon from '#/assets/chainIcon/ergo.svg';
import cardanoIcon from '#/assets/chainIcon/cardano.svg';

export const Chains: Array<IChain> = [
  {
    id: 'ergo',
    name: 'Ergo',
    icon: ergoIcon,
  },
  {
    id: 'cardano',
    name: 'Cardano',
    icon: cardanoIcon,
  },
];
