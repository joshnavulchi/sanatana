import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('contact');

import Client from './contactclient';

export default function Page() {
  return <Client />;
}
