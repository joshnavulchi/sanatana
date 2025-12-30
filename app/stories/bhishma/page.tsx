import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('stories_bhishma');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_bhisma', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.bhishma.title', locale) || 'Karna')
    };
  })();
  return (
    <PageLayout title={'Bhishma'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Bhishma' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/bhishma</p>
    </PageLayout>
  );
}
