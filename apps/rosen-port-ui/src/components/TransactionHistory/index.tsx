import { transactionHistory } from './content';
export { TransactionHistory };

function TransactionHistory() {
  return <section className="flex p-4 items-center bg-gray-300">
        <p className="font-bold"> {transactionHistory}</p>
      </section>
}
