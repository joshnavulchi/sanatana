/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import UsaStrategiesClient from './usaStrategiesClient';

export const generateMetadata = createGenerateMetadata('usa-strategies');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="usa-strategies" />
      <UsaStrategiesClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */