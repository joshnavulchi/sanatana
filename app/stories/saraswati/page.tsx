import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('saraswati_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('saraswati_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('saraswati_story.title', locale) || 'Saraswathi')
    };
  })();
  return (
    <PageLayout
      metaKey="saraswati_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Saraswati' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/saraswati</p>
    </PageLayout>
  );
}
