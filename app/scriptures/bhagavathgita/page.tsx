/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('scriptures_bhagavathgita');
import BhagavathgitaClient from './chapter/pageclient';
import StructuredData from '@/app/components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="scriptures_bhagavathgita" />
      <BhagavathgitaClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */