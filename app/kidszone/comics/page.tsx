import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('comics_kidszone');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('comics_kidszone', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('comics_kidszone.title', locale) || 'Comics')
    };
  })();
  return (
    <PageLayout
      metaKey="comics_kidszone"
      title={'Mythology Comics'}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Mythology Comics' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /kidszone/comics</p>
    </PageLayout>
  );
}
