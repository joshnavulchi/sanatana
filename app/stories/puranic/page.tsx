import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('puranic_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('puranic_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('puranic_story.title', locale) || 'Puranic')
    };
  })();
  return (
    <PageLayout
      metaKey="puranic_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Puranic' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/puranic</p>
    </PageLayout>
  );
}
