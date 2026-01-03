import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('karna_story');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('karna_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('karna_story.title', locale) || 'Karna')
    };
  })();

  return (
    <PageLayout
      metaKey="karna_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Karna' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/karna</p>
    </PageLayout>
  );
}
