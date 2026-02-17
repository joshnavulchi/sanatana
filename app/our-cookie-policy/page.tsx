/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('cookies-policy');

import CookiesClient from './cookies-policyclient';
import StructuredData from '@components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="cookies-policy" />
      <CookiesClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */