/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import FestivalsClient from './festivalsclient';
export const generateMetadata = createGenerateMetadata('festivals');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="festivals" />
      <FestivalsClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
