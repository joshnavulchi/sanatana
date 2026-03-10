/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import VedicPhilosophyClient from './vedicphilosophyclient';
export const generateMetadata = createGenerateMetadata('vedic_philosophy_structure');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="vedic_philosophy_structure" />
      <VedicPhilosophyClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
