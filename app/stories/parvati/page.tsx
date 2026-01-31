import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('parvati_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('parvati_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('parvati_story.title', locale) || 'Parvathi')
    };
  })();
  return (
    <PageLayout
      metaKey="parvati_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Parvati' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/parvati</p>
    </PageLayout>
  );
}
