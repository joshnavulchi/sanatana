import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_visvamitra');

import VisvamitraClient from './visvamitraclient';

export default function Page() {
  return <VisvamitraClient />;
}
