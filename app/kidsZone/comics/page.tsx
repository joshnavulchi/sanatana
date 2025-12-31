import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('kidsZone_comics');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('kidsZone_comics', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories..title', locale) || 'Comics')
    };
  })();
  return (
    <PageLayout metaKey="kidsZone_comics" title={'Mythology Comics'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Mythology Comics' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /kidsZone/comics</p>
    </PageLayout>
  );
}
