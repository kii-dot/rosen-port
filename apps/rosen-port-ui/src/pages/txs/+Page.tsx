import { TransactionHistory } from '#/components/TransactionHistory';

import { AppPage } from '#/components/Page/AppPage';
import { trpc } from '#/trpc/client';
import { useEffect, useState } from 'react';
import { Tokens } from '#/constants/tokens';
import { Chains, getChains } from '#/constants/chains';
import { TxStatus } from '@rosen-port/db';
import { IChain, IToken } from '#/types/chains';

export { Page };

export interface UITx {
  id: string;
  amount: number;
  token: IToken;
  sourceNetwork: IChain;
  sourceWalletAddress: string;
  destWalletAddress: string;
  destNetwork: IChain;
  createdTime: string;
  status: TxStatus;
}

function Page() {
  const [txs, setTxs] = useState<Array<UITx>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const walletAddress = '9hrT4Kt8R4NAJoYiHZ6Cnpo4BcGLA32S58UjckJSxAcRF1xUops';
  useEffect(() => {
    const createResp = async () => {
      const data = await trpc.main.txs.query({ walletAddress: walletAddress });
      const uiTx: Array<UITx> = [];
      if (data.txs) {
        data.txs.forEach((tx) => {
          uiTx.push({
            id: tx.tx.initiatedTxId,
            amount: tx.tx.amount,
            createdTime: tx.tx.createdAt,
            sourceNetwork: getChains(tx.container.sourceChain),
            destNetwork: getChains(tx.container.destChain),
            sourceWalletAddress: tx.tx.sourceAddress,
            destWalletAddress: tx.tx.destAddress,
            // @todo fix up Tokens to map it properly to rosenTokens map
            token: Tokens[1],
            status: tx.tx.txStatus,
          });
        });
        setTxs(uiTx);
        setIsLoading(false);
      }
    };

    createResp();
  }, []);

  return (
    <AppPage>
      <div className="lg:hidden text-2xl text-white justify-start flex mb-8">Transaction History</div>
      <TransactionHistory txsData={txs} isLoading={isLoading} />
    </AppPage>
  );
}
