/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export async function generateMetadata({ params, searchParams }: { params?: any; searchParams?: any }) {
  const p = params && typeof (params as any).then === 'function' ? await (params as any) : params;
  const kanda = typeof p?.kanda === 'string' ? p.kanda : '';
  const folder = kanda.replace(/-kanda$/, '') || kanda;
  return createGenerateMetadata(`itihasa/ramayana/${folder}/index`)({ searchParams });
}

import KandaClient from './kandaClient';

export default function Page() {
  return (
    <KandaClient />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
