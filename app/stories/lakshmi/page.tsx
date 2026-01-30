import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('lakshmi_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('lakshmi_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('lakshmi_story.title', locale) || 'Lakshmi')
    };
  })();
  return (
    <PageLayout
      metaKey="lakshmi_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Lakshmi' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/lakshmi</p>
    </PageLayout>
  );
}
