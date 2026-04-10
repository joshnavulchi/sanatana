/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { promises as fs } from 'fs';
import path from 'path';
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('donate');

import DonateClient from './donateclient';

export default async function Page() {
  const localePath = path.join(process.cwd(), 'public', 'data', 'locales', 'en', 'donate.json');
  let title = '';
  try {
    const file = await fs.readFile(localePath, 'utf8');
    const data = JSON.parse(file);
    title = data.donate?.title || '';
  } catch (e) {
    // ignore
  }

  return (
    <DonateClient initialTitle={title} />
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
