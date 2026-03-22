/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('vedic-philosophy');

import VedicPhilosophyClient from './vedicphilosophyclient';

export default function Page() {
  return (
    <VedicPhilosophyClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */