import { bridge } from './content';
export { Bridge };

function Bridge() {
  return <section className="p-4">
        <p className="text-gray-300 font-bold"> Origin Chain</p>
        <select> 
          <option>Ergo</option>
          <option>ETH</option>
          <option>BTC</option>
          <option>ADA</option>
        </select>
      </section>
}
