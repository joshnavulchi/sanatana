/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export async function generateMetadata(props: any) {
  return createGenerateMetadata('itihasa/mahabharata/index')(props);
}

import MahabharataClient from './mahabharataclient';

export default function Page() {
  return (
    <MahabharataClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
