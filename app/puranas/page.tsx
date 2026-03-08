/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import PuranasClient from './puranasclient';
export const generateMetadata = createGenerateMetadata('puranas');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="puranas" />
      <PuranasClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
