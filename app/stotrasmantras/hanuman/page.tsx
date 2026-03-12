/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stotrasmantras_hanuman');

import HanumanClient from './hanumanclient';

export default function Page() {
  return <HanumanClient />;
}