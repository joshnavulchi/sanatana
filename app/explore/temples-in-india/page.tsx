import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('temples_in_india');

import TemplesInIndiaClient from './temples-in-indiaclient';
import StructuredData from '@components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="temples_in_india" />
      <TemplesInIndiaClient />
    </>
  );
}
