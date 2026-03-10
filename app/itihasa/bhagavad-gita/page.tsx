import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import BhagavadGitaChaptersClient from './chaptersclient';

export const generateMetadata = createGenerateMetadata('itihasa_bhagavad_gita_structure');

export default function Page() {
  return (
    <>
      <StructuredData metaKey="itihasa_bhagavad_gita_structure" />
      <BhagavadGitaChaptersClient />
    </>
  );
}
