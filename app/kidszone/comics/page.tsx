import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('comics_kidsZone');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('comics_kidsZone', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('comics_kidsZone.title', locale) || 'Comics')
    };
  })();
  return (
    <PageLayout
      metaKey="comics_kidsZone"
      title={'Mythology Comics'}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Mythology Comics' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /kidsZone/comics</p>
    </PageLayout>
  );
}
