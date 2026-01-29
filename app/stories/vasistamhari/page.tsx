import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('vasistamaharshi_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('vasistamaharshi_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('vasistamaharshi_story.title', locale) || 'Vasistamaharshi')
    };
  })();
  return (
    <PageLayout
      metaKey="vasistamaharshi_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Vasista Maharshi' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/vasistamhari</p>
    </PageLayout>
  );
}

