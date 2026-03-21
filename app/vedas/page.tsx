/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
export const generateMetadata = createGenerateMetadata('vedas');
import VedasClient from './vedasclient';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="vedas" />
      <VedasClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */