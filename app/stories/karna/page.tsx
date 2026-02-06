import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_karna');

import KarnaClient from './karnaclient';

export default function Page() {
  return <KarnaClient />;
}
