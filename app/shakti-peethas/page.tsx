import { createGenerateMetadata } from 'lib/pageUtils';
export const generateMetadata = createGenerateMetadata('shakti_peethas');

import ShaktiPeethasClient from './shakti-peethasclient';
import StructuredData from '@/app/components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="shakti_peethas" />
      <ShaktiPeethasClient />
    </>
  );
}
