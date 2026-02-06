
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('scriptures_vedas_atharvaveda');

import PageLayout from '@/app/components/common/PageLayout';
import AtharvavedaClient from './atharvavedaclient';

export default function Page() {
  return <AtharvavedaClient />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
