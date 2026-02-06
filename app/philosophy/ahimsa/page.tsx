import { createGenerateMetadata } from '@/lib/pageUtils';
export const generateMetadata = createGenerateMetadata('philosophy_ahimsa');
import AhimsaClient from './ahimsaclient';

export default function Page() {
  return <AhimsaClient />;
}