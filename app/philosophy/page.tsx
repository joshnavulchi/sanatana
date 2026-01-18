import { createGenerateMetadata } from 'lib/pageUtils';

export const generateMetadata = createGenerateMetadata('philosophy');

export default function Page() {
  return (
    <>
      <h1 className="h4">Philosophy</h1>
    </>
  )
}