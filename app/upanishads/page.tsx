/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import UpanishadsClient from './upanishadsclient';
export const generateMetadata = createGenerateMetadata('upanishads');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="upanishads" />
      <UpanishadsClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
