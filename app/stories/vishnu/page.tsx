import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('vishnu_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('vishnu_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('vishnu_story.title', locale) || 'Vishnu')
    };
  })();
  return (
    <PageLayout
      metaKey="vishnu_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Vishnu' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/vishnu</p>
    </PageLayout>
  );
}
