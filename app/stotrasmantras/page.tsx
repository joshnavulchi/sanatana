import { createGenerateMetadata } from 'lib/pageUtils';

export const generateMetadata = createGenerateMetadata('stotrasmantras');

export default function Page() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-amber-100">Stotras and Mantras</h1>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Explore Sub Pages:</h2>
        <ul className="list-disc ml-6">
          <li><a href="/stotrasmantras/dailyPrayers" className="text-blue-600 hover:underline">Daily Prayers</a></li>
          <li><a href="/stotrasmantras/devi" className="text-blue-600 hover:underline">Devi</a></li>
          <li><a href="/stotrasmantras/ganesha" className="text-blue-600 hover:underline">Ganesha</a></li>
          <li><a href="/stotrasmantras/hanuman" className="text-blue-600 hover:underline">Hanuman</a></li>
          <li><a href="/stotrasmantras/shiva" className="text-blue-600 hover:underline">Shiva</a></li>
          <li><a href="/stotrasmantras/vishnu" className="text-blue-600 hover:underline">Vishnu</a></li>
        </ul>
      </div>
    </>
  )
}