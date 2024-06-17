import { activeBatch } from './content';
export { ActiveBatches };

function ActiveBatches() {
  return <section className="flex p-4 items-center bg-gray-300">
      <p className='font-bold'> {activeBatch}</p>
    </section>
}
