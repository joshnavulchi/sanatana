/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import ItihasaClient from './itihasaclient';
export const generateMetadata = createGenerateMetadata('itihasa');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="itihasa" />
      <ItihasaClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
