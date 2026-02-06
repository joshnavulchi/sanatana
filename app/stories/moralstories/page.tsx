import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_moralstories');

import MoralStoriesClient from './moralstoriesclient';

export default function Page() {
  return <MoralStoriesClient />;
}
