import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('krishna_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('krishna_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('krishna_story.title', locale) || 'Krishna')
    };
  })();
  return (
    <PageLayout
      metaKey="krishna_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Krishna' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/krishna</p>
    </PageLayout>
  );
}
