/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export async function generateMetadata({ params, searchParams }: { params?: any; searchParams?: any }) {
  const p = params && typeof (params as any).then === 'function' ? await (params as any) : params;
  const parva = typeof p?.parva === 'string' ? p.parva : '';
  const folder = parva.replace(/-parva$/, '') || parva;
  return createGenerateMetadata(`itihasa/mahabharata/${folder}/index`)({ searchParams });
}

import ParvaClient from './parvaClient';

export default function Page() {
  return (
    <ParvaClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
