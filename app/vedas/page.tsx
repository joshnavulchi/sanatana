/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import VedasClient from './vedasclient';
export const generateMetadata = createGenerateMetadata('vedas');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="vedas" />
      <VedasClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
