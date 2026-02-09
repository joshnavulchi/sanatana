import { createGenerateMetadata } from 'lib/pageUtils';

export const generateMetadata = createGenerateMetadata('kidszone');

export default function Page() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl dark:text-amber-100">Kids Zone</h1>
    </>
  )
}