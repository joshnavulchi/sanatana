import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_bramha');

import BramhaClient from './bramhaclient';

export default function Page() {
  return <BramhaClient />;
}
