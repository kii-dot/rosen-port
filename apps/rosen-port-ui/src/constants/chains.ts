import { IChain } from '#/types/chains';
import ergoIcon from '#/assets/chainIcon/ergo.svg';
import cardanoIcon from '#/assets/chainIcon/cardano.svg';
import bitcoinIcon from '#/assets/chainIcon/bitcoin.svg';

export enum Networks {
  Ergo = 'Ergo',
  Cardano = 'Cardano',
  Bitcoin = 'Bitcoin',
}

const ErgoChain: IChain = {
  id: 'ergo',
  name: 'Ergo',
  icon: ergoIcon,
};

const CardanoChain: IChain = {
  id: 'cardano',
  name: 'Cardano',
  icon: cardanoIcon,
};

const BitcoinChain: IChain = {
  id: 'bitcoin',
  name: 'Bitcoin',
  icon: bitcoinIcon,
};

export const NetworkChains = {
  btc: BitcoinChain,
  ergo: ErgoChain,
  cardano: CardanoChain,
};

export const Chains: Array<IChain> = [ErgoChain, CardanoChain];

export const getChains = (network: string): IChain => {
  switch (network) {
    case 'bitcoin':
      return BitcoinChain;
    case 'ergo':
      return ErgoChain;
    case 'cardano':
      return CardanoChain;
    default:
      throw new Error('Chain not supported');
  }
};
