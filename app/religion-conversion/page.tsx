/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '../../lib/pageUtils';
export const generateMetadata = createGenerateMetadata('religion_conversion');

import ReligionClient from './religionClient';
import StructuredData from '@/app/components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="religion_conversion" />
      <ReligionClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */