import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('visvamitra_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('visvamitra_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('visvamitra_story.title', locale) || 'Visvamitra')
    };
  })();
  return (
    <PageLayout
      metaKey="visvamitra_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Vishvamitra' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/visvamitra</p>
    </PageLayout>
  );
}
