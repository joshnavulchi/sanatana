/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import PhilosophyListClient from './philosophyclient';
export const generateMetadata = createGenerateMetadata('philosophy');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="philosophy" />
      <PhilosophyListClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */