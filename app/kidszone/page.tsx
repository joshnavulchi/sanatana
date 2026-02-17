import { createGenerateMetadata } from '@lib/pageUtils';
import Link from 'next/link';

export const generateMetadata = createGenerateMetadata('kidszone');

export default function Page() {
  return (
    <>
      <h3 className="text-2xl md:text-3xl text-gray-900">Kids Zone</h3>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Explore Sub Pages:</h2>
        <ul className="list-disc ml-6">
          <li><Link href="/kidszone/comics/" className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
            Comics
          </Link></li>
          <li><Link href="/kidszone/easymantras/" className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
            Easy Mantras
          </Link></li>
          <li><Link href="/kidszone/illustratedstories/" className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
            Illustrated Stories
          </Link></li>
          <li><Link href="/kidszone/mythologicalquizzes/" className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
            Mythological Quizzes
          </Link></li>
        </ul>
      </div>
    </>
  )
}