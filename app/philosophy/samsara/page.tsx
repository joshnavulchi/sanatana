/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('philosophy_samsara');

import SamsaraClient from './samsaraclient';

export default function Page() {
  return <SamsaraClient />;
}