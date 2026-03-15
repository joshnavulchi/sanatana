/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import SanskritConceptsClient from './sanskritconceptsclient';
export const generateMetadata = createGenerateMetadata('sanskrit_concepts');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="sanskrit_concepts" />
      <SanskritConceptsClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
