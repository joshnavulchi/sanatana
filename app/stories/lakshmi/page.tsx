import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createcreateGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createcreateGenerateMetadata('stories_lakshmi');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_lakshmi', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.lakshmi.title', locale) || 'Lakshmi')
    };
  })();
  return (
    <PageLayout metaKey="stories_lakshmi" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Lakshmi' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/lakshmi</p>
    </PageLayout>
  );
}
