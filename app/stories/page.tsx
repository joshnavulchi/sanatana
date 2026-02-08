import { createGenerateMetadata } from 'lib/pageUtils';

export const generateMetadata = createGenerateMetadata('stories');

export default function Page() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl">Stories</h1>
    </>
  )
}