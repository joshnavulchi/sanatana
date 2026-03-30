/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export async function generateMetadata(props: any) {
  return createGenerateMetadata('itihasa/bhagavadgita/index')(props);
}

import BhagavadGitaClient from './bhagavadgitaclient';

export default function Page() {
  return (
    <BhagavadGitaClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
