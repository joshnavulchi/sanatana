import PageLayout from '@components/common/PageLayout';
import { t, getMeta, detectLocale } from '../../../lib/i18n';


export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;

  const page: any = (() => {
    const k: any = getMeta('stories_shiva', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.shiva.title', locale) || 'Shiva')
    };
  })();

  return (
    <PageLayout metaKey="stories_shiva" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Shiva' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/shiva</p>
    </PageLayout>
  );
}
