import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('kidszone_mythologycomics');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('kidszone_mythologycomics', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('kidszone_mythologycomics.title', locale) || 'Comics')
    };
  })();
  return (
    <PageLayout
      metaKey="kidszone_mythologycomics"
      title={'Mythology Comics'}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Mythology Comics' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /kidszone/comics</p>
    </PageLayout>
  );
}
