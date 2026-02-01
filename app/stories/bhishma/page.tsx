import { getMeta, detectLocale, t } from '../../../lib/i18n';

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'bhishma_story' ? parts.shift() : 'bhishma_story';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('bhishma_story');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('bhishma_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('bhishma_story.title') || 'Bhishma')
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
