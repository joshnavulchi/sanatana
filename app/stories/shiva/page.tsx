import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_shiva');

import ShivaClient from './shivaclient';

export default function Page() {
  return <ShivaClient />;
}
