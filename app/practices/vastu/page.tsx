import { createGenerateMetadata } from 'lib/pageUtils';
export const generateMetadata = createGenerateMetadata('vastu_practices');

import VastuClient from './vastuclient';

export default function Page() {
  return <VastuClient />;
}