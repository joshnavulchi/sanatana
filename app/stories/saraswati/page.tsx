
import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_saraswati');

import SaraswatiClient from './saraswaticlient';

export default function Page() {
  return <SaraswatiClient />;
}
