import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import AuditViewer from './AuditViewer.client';

export const generateMetadata = createGenerateMetadata('post_deploy_audit');

export default async function Page() {
  return (
    <>
      <StructuredData metaKey="post_deploy_audit" />
      <main className="mx-auto max-w-4xl">
        <AuditViewer />
      </main>
    </>
  );
}
