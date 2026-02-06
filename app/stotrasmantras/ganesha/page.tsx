
import { createGenerateMetadata } from 'lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stotrasmantras_ganesha');

import GaneshaClient from './ganeshaclient';

export default function Page() {
  return <GaneshaClient />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
