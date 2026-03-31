/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import BhagavadGitaClient from './BhagavadgitaClient';
import { createGenerateMetadata } from '@lib/pageUtils';

export const generateMetadata = createGenerateMetadata('itihasa/bhagavadgita/index');

export default function Page() {
  return (
    <BhagavadGitaClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
