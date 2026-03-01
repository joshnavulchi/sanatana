import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('contact');

import Client from './contactclient';
import StructuredData from '../components/structured-data/StructuredData';
import WebVitalsReporter from '../components/WebVitalsReporter';

export default function Page() {
  return <>
    <StructuredData metaKey="contact" />
    <WebVitalsReporter page="contact" />
    <Client />;
  </>
}
