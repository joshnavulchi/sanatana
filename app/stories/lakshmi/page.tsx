
import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_lakshmi');

import LakshmiClient from './lakshmiclient';

export default function Page() {
  return <LakshmiClient />;
}
