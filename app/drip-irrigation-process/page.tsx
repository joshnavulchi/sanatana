/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import DropIrrigationClient from './dripirrigation';
export const generateMetadata = createGenerateMetadata('drip-irrigation-process');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="drip-irrigation-process" />
      <DropIrrigationClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */