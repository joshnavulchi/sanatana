import { createGenerateMetadata } from 'lib/pageUtils';
export const generateMetadata = createGenerateMetadata('dailypuja_practices');

import DailypujaClient from './dailypujaclient';
import StructuredData from '@/app/components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="dailypuja_practices" />
      <DailypujaClient />
    </>
  );
}