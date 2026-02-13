import { createGenerateMetadata } from 'lib/pageUtils';
export const generateMetadata = createGenerateMetadata('festivals_practices');

import FestivalsClient from './festivalsclient';

export default function Page() {
  return <FestivalsClient />;
}