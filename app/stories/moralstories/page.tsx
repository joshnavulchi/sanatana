import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('moralstories');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('moralstories', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('moralstories.title', locale) || 'Moral stores')
    };
  })();
  return (
    <PageLayout
      metaKey="moralstories"
      title={page.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'Moral Stories' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/moralstories</p>
    </PageLayout>
  );
}
