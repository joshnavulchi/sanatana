/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('explore');

import ExploreClient from './exploreclient';

export default function Page() {
  return (
    <ExploreClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */