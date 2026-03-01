/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('donate');

import DonateClient from './donateclient';
import StructuredData from '../components/structured-data/StructuredData';
import WebVitalsReporter from '../components/WebVitalsReporter';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="donate" />
      <WebVitalsReporter page="donate" />
      <DonateClient />;
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */