import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createcreateGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createcreateGenerateMetadata('stories_parvati');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_parvati', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.parvati.title', locale) || 'Parvathi')
    };
  })();
  return (
    <PageLayout metaKey="stories_parvati" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Parvati' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/parvati</p>
    </PageLayout>
  );
}
