import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('stories_saraswati');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_saraswati', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.saraswati.title', locale) || 'Saraswathi')
    };
  })();
  return (
    <PageLayout metaKey="stories_saraswati" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Saraswati' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/saraswati</p>
    </PageLayout>
  );
}
