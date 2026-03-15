
import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('cosmictime');

import CosmictimeClient from './cosmictimeclient';
import StructuredData from '@components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="cosmictime" />
      <CosmictimeClient />
    </>
  );
}
