import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createcreateGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createcreateGenerateMetadata('stories_vasistamaharshi');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_vasistamaharshi', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.vasistamhari.title', locale) || 'Vasistamaharshi')
    };
  })();
  return (
    <PageLayout metaKey="stories_vasistamaharshi" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Vasista Maharshi' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/vasistamhari</p>
    </PageLayout>
  );
}

