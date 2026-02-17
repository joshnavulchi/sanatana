import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_krishna');

import KrishnaClient from './krishnaclient';

export default function Page() {
  return <KrishnaClient />;
}
