import { createGenerateMetadata } from 'lib/pageUtils';

export const generateMetadata = createGenerateMetadata('stories');

export default function Page() {
  return (
    <>
      <h1 className="h4">Stories</h1>
    </>
  )
}