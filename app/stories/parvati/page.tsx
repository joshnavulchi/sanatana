
// ...existing code...
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
// ...existing code...

export default function Page() {
  const { locale } = useLocale();
  const ns = useLocaleSection('parvati_story');

  const title = ns?.title || 'Parvati';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Parvati';

  return (
    <PageLayout
      metaKey="parvati_story"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
