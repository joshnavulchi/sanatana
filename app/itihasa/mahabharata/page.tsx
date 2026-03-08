/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import MahabharataClient from './mahabharataclient';
export const generateMetadata = createGenerateMetadata('scriptures_mahabharata');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="scriptures_mahabharata" />
      <MahabharataClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
