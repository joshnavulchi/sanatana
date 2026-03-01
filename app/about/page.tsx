/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('about');

import StructuredData from '@components/structured-data/StructuredData';
import AboutClient from './aboutclient';
import WebVitalsReporter from '../components/WebVitalsReporter';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="about" />
      {process.env.NODE_ENV !== 'production' && <WebVitalsReporter page="about" />}
      <AboutClient />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */