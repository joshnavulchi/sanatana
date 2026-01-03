import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('ramanamaharshi_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('ramanamaharshi_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('ramanamaharshi_story.title', locale) || 'Ramanamaharshi')
    };
  })();
  return (
    <PageLayout
      metaKey="ramanamaharshi_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Ramana Maharshi' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/ramanamaharshi</p>
    </PageLayout>
  );
}
