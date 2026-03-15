import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('temples_destroyed');

import TemplesDestroyedClient from './temples-destroyedclient';
import StructuredData from '@components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="temples_destroyed" />
      <TemplesDestroyedClient />
    </>
  );
}
