import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createcreateGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createcreateGenerateMetadata('stories_ramanamaharshi');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_ramanamaharshi', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.ramanamaharshi.title', locale) || 'Ramanamaharshi')
    };
  })();
  return (
    <PageLayout metaKey="stories_ramanamaharshi" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Ramana Maharshi' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/ramanamaharshi</p>
    </PageLayout>
  );
}
