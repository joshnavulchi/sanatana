import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createcreateGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createcreateGenerateMetadata('stories_bramha');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('stories_bramha', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories.bramha.title', locale) || 'Bramha')
    };
  })();
  return (
    <PageLayout title={'Brahma'} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Brahma' }]}>
      <p>Placeholder page generated from locales/en/nav.json for path /stories/bramha</p>
    </PageLayout>
  );
}
