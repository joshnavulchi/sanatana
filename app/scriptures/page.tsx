import { createGenerateMetadata } from 'lib/pageUtils';

export const generateMetadata = createGenerateMetadata('scriptures');

export default function Page() {
  return (
    <>
      <h1 className="h4">Scriptures</h1>
    </>
  )
}