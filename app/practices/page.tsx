import { createGenerateMetadata } from 'lib/pageUtils';

export const generateMetadata = createGenerateMetadata('practices');

export default function Page() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-amber-100">Practices</h1>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Explore Sub Pages:</h2>
        <ul className="list-disc ml-6">
          <li><a href="/practices/dailypuja" className="text-blue-600 hover:underline">Daily Puja</a></li>
          <li><a href="/practices/festivals" className="text-blue-600 hover:underline">Festivals</a></li>
          <li><a href="/practices/rituals" className="text-blue-600 hover:underline">Rituals</a></li>
          <li><a href="/practices/vastu" className="text-blue-600 hover:underline">Vastu</a></li>
        </ul>
      </div>
    </>
  )
}