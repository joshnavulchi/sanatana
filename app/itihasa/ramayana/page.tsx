/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export async function generateMetadata(props: any) {
  return createGenerateMetadata('itihasa/ramayana/index')(props);
}

import RamayanaClient from './ramayanaclient';

export default function Page() {
  return (
    <RamayanaClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
