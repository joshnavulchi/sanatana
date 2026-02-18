import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('indian_constition');

import ConstitutionClient from './constitutionclient';
import StructuredData from '@components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="indian_constition" />
      <ConstitutionClient />
    </>
  );
}
