import { createGenerateMetadata } from 'lib/pageUtils';

export const generateMetadata = createGenerateMetadata('stories');

export default function Page() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-amber-100">Stories</h1>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Explore Sub Pages:</h2>
        <ul className="list-disc ml-6">
          <li><a href="/stories/adishankar" className="text-blue-600 hover:underline">Adi Shankar</a></li>
          <li><a href="/stories/bhishma" className="text-blue-600 hover:underline">Bhishma</a></li>
          <li><a href="/stories/bramha" className="text-blue-600 hover:underline">Bramha</a></li>
          <li><a href="/stories/karna" className="text-blue-600 hover:underline">Karna</a></li>
          <li><a href="/stories/krishna" className="text-blue-600 hover:underline">Krishna</a></li>
          <li><a href="/stories/lakshmi" className="text-blue-600 hover:underline">Lakshmi</a></li>
          <li><a href="/stories/moralstories" className="text-blue-600 hover:underline">Moral Stories</a></li>
          <li><a href="/stories/parasuram" className="text-blue-600 hover:underline">Parasuram</a></li>
          <li><a href="/stories/parvati" className="text-blue-600 hover:underline">Parvati</a></li>
          <li><a href="/stories/puranic" className="text-blue-600 hover:underline">Puranic</a></li>
          <li><a href="/stories/ramanamaharshi" className="text-blue-600 hover:underline">Ramanamaharshi</a></li>
          <li><a href="/stories/saraswati" className="text-blue-600 hover:underline">Saraswati</a></li>
          <li><a href="/stories/shiva" className="text-blue-600 hover:underline">Shiva</a></li>
          <li><a href="/stories/vasistamhari" className="text-blue-600 hover:underline">Vasistamhari</a></li>
          <li><a href="/stories/vishnu" className="text-blue-600 hover:underline">Vishnu</a></li>
          <li><a href="/stories/visvamitra" className="text-blue-600 hover:underline">Visvamitra</a></li>
        </ul>
      </div>
    </>
  )
}