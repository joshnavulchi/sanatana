import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('adiShankaracharya_story');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('adiShankaracharya_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('adiShankaracharya_story.title', locale) || 'AdiShankaracharya')
    };
  })();

  return (
    <PageLayout
      metaKey="adiShankaracharya_story"
      title={'AdiShankaracharya'}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'AdiShankaracharya' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/adishankar</p>
    </PageLayout>
  );
}