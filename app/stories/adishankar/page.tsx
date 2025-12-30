import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('stories_adishankar');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_adishankar', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.karna.title', locale) || 'Karna')
    };
  })();
  return (
    <PageLayout title={'Adishankar'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Adishankar' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/adishankar</p>
    </PageLayout>
  );
}