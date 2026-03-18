/* Copyright (c) 2026 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import VedicScienceClient from './vedicscienceclient';

export const generateMetadata = createGenerateMetadata('vedic_science');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="vedic_science" />
      <VedicScienceClient />
    </>
  );
}
