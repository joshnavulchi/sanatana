import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('shiva_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('shiva_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('shiva_story.title', locale) || 'Shiva')
    };
  })();
  return (
    <PageLayout
      metaKey="shiva_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Shiva' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/shiva</p>
    </PageLayout>
  );
}
