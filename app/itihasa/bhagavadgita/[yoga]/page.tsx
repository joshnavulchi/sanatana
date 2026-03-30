/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export async function generateMetadata({ params, searchParams }: { params?: any; searchParams?: any }) {
  const p = params && typeof (params as any).then === 'function' ? await (params as any) : params;
  const yoga = typeof p?.yoga === 'string' ? p.yoga : '';
  return createGenerateMetadata(`itihasa/bhagavadgita/${yoga}/index`)({ searchParams });
}

import YogaClient from './yogaClient';

export default function Page() {
  return (
    <YogaClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
