import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('parasuram_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('parasuram_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('parasuram_story.title', locale) || 'Parasuram')
    };
  })();
  return (
    <PageLayout
      metaKey="parasuram_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Parasuram' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/parasuram</p>
    </PageLayout>
  );
}
