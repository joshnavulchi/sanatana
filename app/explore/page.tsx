/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
export const generateMetadata = createGenerateMetadata('explore');
import ExploreClient from './exploreclient';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="explore" />
      <ExploreClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */