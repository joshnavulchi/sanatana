import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('stories_visvamitra');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_visvamitra', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.visvamitra.title', locale) || 'Visvamitra')
    };
  })();
  return (
    <PageLayout metaKey="stories_visvamitra" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Vishvamitra' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/visvamitra</p>
    </PageLayout>
  );
}
