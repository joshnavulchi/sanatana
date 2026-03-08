/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import BhagavadGitaClient from './bhagavadgitaclient';
export const generateMetadata = createGenerateMetadata('scriptures_bhagavadgita');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="scriptures_bhagavadgita" />
      <BhagavadGitaClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
