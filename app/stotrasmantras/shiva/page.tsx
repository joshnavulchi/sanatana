/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from 'lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stotrasmantras_shiva');

import ShivaClient from './shivaclient';

export default function Page() {
  return <ShivaClient />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */