import { createGenerateMetadata } from 'lib/pageUtils';
export const generateMetadata = createGenerateMetadata('ritual_practices');

import RitualsClient from './ritualsclient';

export default function Page() {
  return <RitualsClient />;
}
