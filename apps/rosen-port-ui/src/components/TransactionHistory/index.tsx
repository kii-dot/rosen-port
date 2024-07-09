import { ArrowLongRightIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { RoundedLabel } from '../Label';
import { BlockSearch } from '../Icons';
import { TxStatus } from '@rosen-port/db';
import { Link } from '../Link';
import { GetTxUrl } from '#/constants/networkUrl';
import moment from 'moment';
import { UITx } from '#/pages/txs/+Page';
import { Networks } from '#/constants/chains';
import { truncate } from '#/tools/generic/addressTruncate';

export { TransactionHistory };

interface TransactionHistoryProps {
  txsData: Array<UITx>;
}

const getTxStatus = (txStatus: TxStatus) => {
  var strokeColor;
  var bgColor;
  var statusMessage;
  switch (txStatus) {
    case TxStatus.drafted:
    case TxStatus.unconfirmed:
    case TxStatus.confirmed:
      strokeColor = 'text-yellow-400';
      bgColor = 'bg-yellow-400';
      statusMessage = 'Onboarding Tx to container';
      break;
    case TxStatus.bridged:
      strokeColor = 'text-blue-400';
      bgColor = 'bg-blue-400';
      statusMessage = 'Container with Tx bridged';
      break;
    case TxStatus.sent:
      strokeColor = 'text-teal-400';
      bgColor = 'bg-teal-400';
      statusMessage = 'Transferred Successfully';
      break;
    case TxStatus.refunding:
      strokeColor = 'text-red-400';
      bgColor = 'bg-red-400';
      statusMessage = 'Refund being processed';
      break;
    case TxStatus.refund_completed:
      strokeColor = 'text-red-400';
      bgColor = 'bg-red-400';
      statusMessage = 'Refund Completed';
      break;
  }
  return (
    <div className="flex flex-row items-center contents-center space-x-2">
      <div className={classNames('w-2 h-2 rounded-full', bgColor)} />
      <div className={classNames(strokeColor, 'text-xs font-thin')}>{statusMessage}</div>
    </div>
  );
};

function TransactionHistory({ txsData }: TransactionHistoryProps) {
  const renderRealTxs = () => {
    return txsData.map((txData) => {
      const tx = txData;
      const createdDate = new Date(tx.createdTime);
      return (
        <div
          key={tx.id}
          className="grid grid-cols-4 lg:grid-cols-12 text-white py-4 space-y-1 border-b border-slate-800/70"
        >
          {/** Token */}
          <div className="col-span-3 lg:col-span-3">
            <div className="flex flex-row items-center">
              <img src={tx.token.icon} alt="" className="h-8 w-8 flex-shrink-0 rounded-full mr-2" />
              <div className="pl-2">
                <div className="text-sm">
                  {tx.amount} {tx.token.name}
                </div>
                <div className="text-xs font-thin text-left text-gray-400">~ ${tx.amount}</div>
              </div>
            </div>
          </div>
          {/** Token end */}
          {/** Date */}
          <div className="col-span-1 lg:col-span-2 flex flex-col items-end lg:items-start content-center">
            <div className="text-sm">
              {createdDate.getDate()} {createdDate.toLocaleString('default', { month: 'long' })}{' '}
              {createdDate.getFullYear()}
            </div>
            <div className="text-xs font-thin text-gray-400">
              {createdDate.getHours()}:{createdDate.getMinutes()}
            </div>
          </div>
          {/** Date end */}
          {/** Bridge Route */}
          <div className="col-span-4 lg:col-span-2 flex justify-left items-center">
            <RoundedLabel name={tx.sourceNetwork.name} icon={tx.sourceNetwork.icon} id={tx.sourceNetwork.id} iconOnly />
            <div className="lg:hidden text-xs items-center ml-2 text-gray-300 font-thin">
              {truncate(tx.sourceWalletAddress, 10, '...')}
            </div>
            <ArrowLongRightIcon className="w-4 h-4 mx-2" />
            <RoundedLabel name={tx.destNetwork.name} icon={tx.destNetwork.icon} id={tx.destNetwork.id} iconOnly />
            <div className="lg:hidden text-xs items-center ml-2 text-gray-300 font-thin">
              {truncate(tx.destWalletAddress, 10, '...')}
            </div>
          </div>
          {/** Bridge Route end */}
          {/** Status */}
          <div className="col-span-2 lg:col-span-3 flex justify-left items-center">{getTxStatus(tx.status)}</div>
          {/** Status End */}
          {/** Block Search Button*/}
          <div className="col-span-2 justify-end lg:col-span-2 flex lg:justify-center lg:items-center">
            <Link
              href={GetTxUrl(tx.sourceNetwork.name as Networks, tx.id)}
              target="_blank"
              className="bg-gray-700/30 w-7 h-7 rounded-full flex items-center justify-center  drop-shadow-sm hover:drop-shadow-md hover:bg-gray-700 hover:text-slate-200 active:bg-gray-900 active:text-slate-300 active:shadow-inner shadow-2x"
            >
              <BlockSearch className="w-4 h-4" />
            </Link>
          </div>
          {/** Block Search Button End*/}
        </div>
      );
    });
  };

  const renderTxs = () => {
    if (txsData.length > 0) {
      return renderRealTxs();
    } else {
      // Do skeleton here
    }
  };

  return (
    <div>
      {/** Table Head
       * Unfortunately we have to use div so that we can design
       * the mobile screen better
       */}
      <div className="hidden lg:grid grid-cols-12 text-xs text-left text-gray-300 font-thin py-2 border-b border-slate-600/70">
        <div className="col-span-3">Token</div>
        <div className="col-span-2">Time & Date</div>
        <div className="col-span-2">Bridge Route</div>
        <div className="col-span-3">Status</div>
        <div className="col-span-2 justify-self-center">Actions</div>
      </div>
      {renderTxs()}
    </div>
  );
}
