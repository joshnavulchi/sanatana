import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createcreateGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createcreateGenerateMetadata('stories_karna');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_karna', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.karna.title', locale) || 'Karna')
    };
  })();
  return (
    <PageLayout metaKey="stories_karna" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Karna' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/karna</p>
    </PageLayout>
  );
}
