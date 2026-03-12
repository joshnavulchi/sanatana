import { createGenerateMetadata } from '@lib/pageUtils';
export const generateMetadata = createGenerateMetadata('rivers_connecting');

import RiversConnectingClient from './riversconnectingclient';
import StructuredData from '@components/structured-data/StructuredData';

export default function Page() {
  return (
    <>
      <StructuredData metaKey="rivers_connecting" />
      <RiversConnectingClient />
    </>
  );
}
