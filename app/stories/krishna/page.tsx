import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('stories_krishna');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_krishna', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.krishna.title', locale) || 'Krishna')
    };
  })();
  return (
    <PageLayout metaKey="stories_krishna" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Krishna' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/krishna</p>
    </PageLayout>
  );
}
