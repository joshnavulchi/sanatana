/* Copyright (c) 2026 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('vedic-science');

import VedicScienceClient from './VedicScienceClient';

export default function Page() {
  return (
    <VedicScienceClient />
  );
}
