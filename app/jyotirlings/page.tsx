import { createGenerateMetadata } from 'lib/pageUtils';
export const generateMetadata = createGenerateMetadata('jyotirlings');

import JyotirlingsClient from './jyotirlingsclient';
import StructuredData from '@/app/components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="jyotirlings" />
      <JyotirlingsClient />
    </>
  );
}
