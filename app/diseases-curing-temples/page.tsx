import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('diseases_curing_temples');

import DiseasesCuringTemplesClient from './diseases-curing-templesclient';
import StructuredData from '@components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="diseases_curing_temples" />
      <DiseasesCuringTemplesClient />
    </>
  );
}
