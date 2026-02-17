import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('philosophy_advaita');
import AdvaitaClient from './advaitaclient';

export default function Page() {
  return <AdvaitaClient />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */