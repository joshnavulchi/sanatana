import { createGenerateMetadata } from 'lib/pageUtils';

export const generateMetadata = createGenerateMetadata('practices');

export default function Page() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl">Practices</h1>
    </>
  )
}