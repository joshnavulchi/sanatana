
import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('stories_vasistamhari');

import VasistamaharshiClient from './vasistamaharshiclient';

export default function Page() {
  return <VasistamaharshiClient />;
}