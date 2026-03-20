import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
export const generateMetadata = createGenerateMetadata('contact');
import Client from './contactclient';


export default function Page() {
  return (
    <>
      <StructuredData metaKey="contact" />
      <Client />
    </>
  );
}
