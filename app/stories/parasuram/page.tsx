import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('parasuram_story');

import ParasuramClient from './parasuramclient';

export default function Page() {
  return <ParasuramClient />;
}
