/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '../../lib/pageUtils';
export const generateMetadata = createGenerateMetadata('world_transition');

import WorldTransitionContent from './world-transition-client';
import StructuredData from '@/app/components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="world_transition" />
      <WorldTransitionContent />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
