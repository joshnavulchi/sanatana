import PageLayout from '@components/common/PageLayout';
import { t, getMeta, detectLocale } from '../../../lib/i18n';


export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;

  const page: any = (() => {
    const k: any = getMeta('stories_parasuram', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.parasuram.title', locale) || 'Parasuram')
    };
  })();

  return (
    <PageLayout metaKey="stories_parasuram" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Parasuram' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/parasuram</p>
    </PageLayout>
  );
}
