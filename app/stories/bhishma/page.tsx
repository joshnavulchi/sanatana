import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('bhishma_story');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('bhishma_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('bhishma_story.title', locale) || 'Bhishma')
    };
  })();

  return (
    <PageLayout
      metaKey="bhishma_story"
      title={'Bhishma'}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Bhishma' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/bhishma</p>
    </PageLayout>
  );
}
