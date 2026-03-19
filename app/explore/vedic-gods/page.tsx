/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import VedicGodsClient from './vedicgodsclient';
export const generateMetadata = createGenerateMetadata('vedic_gods');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="vedic_gods" />
      <VedicGodsClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
