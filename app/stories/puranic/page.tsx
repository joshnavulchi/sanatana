
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_puranic');

import PuranicClient from './puranicclient';

export default function Page() {
  return <PuranicClient />;
}
