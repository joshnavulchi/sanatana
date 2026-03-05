import { createGenerateMetadata } from '@lib/pageUtils';

export const generateMetadata = createGenerateMetadata('scriptures');

export default function Page() {
  return (
    <>
      <h3 className="text-2xl md:text-3xl text-gray-900">Scriptures</h3>
      <div className="mt-8">
        <h2 className="text-md md:text-lg font-bold mb-2">Explore Sub Pages:</h2>
        <ul className="list-disc ml-6">
          <li><a href="/scriptures/bhagavathgita" className="text-blue-600 hover:underline">Bhagavath Gita</a></li>
          <li><a href="/scriptures/ramayana" className="text-blue-600 hover:underline">Ramayana</a></li>
          <li><a href="/scriptures/mahabharata" className="text-blue-600 hover:underline">Mahabharata</a></li>
          <li><a href="/scriptures/sanksheparamayanam" className="text-blue-600 hover:underline">Sankshepa Ramayanam</a></li>
          <li><a href="/scriptures/upanishads" className="text-blue-600 hover:underline">Upanishads</a></li>
          <li><a href="/scriptures/vedas" className="text-blue-600 hover:underline">Vedas</a></li>
          <li><a href="/scriptures/itihasas" className="text-blue-600 hover:underline">Itihasas</a></li>
          <li><a href="/scriptures/puranas" className="text-blue-600 hover:underline">Puranas</a></li>
        </ul>
      </div>
    </>
  )
}