/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import RamayanaClient from './ramayanaclient';
export const generateMetadata = createGenerateMetadata('scriptures_ramayana');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="scriptures_ramayana" />
      <RamayanaClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
