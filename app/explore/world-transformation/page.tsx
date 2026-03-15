/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('world_transformation');

import WorldTransformationContent from './world-transformation-client';
import StructuredData from '@components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="world_transformation" />
      <WorldTransformationContent />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
