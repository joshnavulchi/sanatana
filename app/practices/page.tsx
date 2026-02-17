import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('practices');

import PracticesClient from './practicesclient';

export default function Page() {
  return <PracticesClient />;
}