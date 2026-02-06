
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_parvati');

import ParvatiClient from './parvaticlient';

export default function Page() {
  return <ParvatiClient />;
}
