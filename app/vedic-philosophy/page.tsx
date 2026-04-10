/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@/lib/pageUtils';
import VedicClient from './VedicPhilosophyClient';

export const generateMetadata = createGenerateMetadata('vedic-philosophy');

export default function Page() {
  return <VedicClient />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
