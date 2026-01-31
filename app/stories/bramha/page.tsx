import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('brahma_story');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('brahma_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.bramha.title', locale) || 'Bramha')
    };
  })();

  return (
    <PageLayout
      metaKey="brahma_story"
      title={'Brahma'}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Brahma' }]}
      className="md"
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/bramha</p>
    </PageLayout>
  );
}
