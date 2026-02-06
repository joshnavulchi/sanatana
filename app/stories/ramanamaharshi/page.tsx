import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_ramanamaharshi');

import RamanamaharshiClient from './ramanamaharshiclient';

export default function Page() {
  return <RamanamaharshiClient />;
}
