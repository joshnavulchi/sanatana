import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_vishnu');

import VishnuClient from './vishnuclient';

export default function Page() {
  return <VishnuClient />;
}
