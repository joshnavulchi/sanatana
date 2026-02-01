import { getMeta, detectLocale, t } from '../../../lib/i18n';

const ns = useLocaleSection('stories');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'stories' ? parts.shift() : 'stories';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { createGenerateMetadata } from 'lib/pageUtils';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('brahma_story');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('brahma_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('stories.bramha.title') || 'Bramha')
    };
  })();

  return (
    <PageLayout
      metaKey="brahma_story"
      title={'Brahma'}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Brahma' }]}
      className="md"
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/bramha</p>
    </PageLayout>
  );
}
