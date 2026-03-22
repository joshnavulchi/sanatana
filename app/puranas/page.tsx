/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('purans');

import PuranasClient from './puranasclient';

export default function Page() {
  return (
    <PuranasClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */