import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('dashboard');
import EnterpriseDashboard from '@components/EnterpriseDashboard';

export default function Page() {
  return <EnterpriseDashboard />;
}
