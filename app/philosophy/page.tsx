import { createGenerateMetadata } from '@lib/pageUtils';

export const generateMetadata = createGenerateMetadata('philosophy');

export default function Page() {
  return (
    <>
      <h3 className="text-2xl md:text-3xl text-gray-900">Philosophy</h3>
    </>
  )
}