import { getMeta, detectLocale, t } from '../../../lib/i18n';

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'krishna_story' ? parts.shift() : 'krishna_story';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('krishna_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('krishna_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('krishna_story.title') || 'Krishna')
    };
  })();
  return (
    <PageLayout
      metaKey="krishna_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Krishna' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/krishna</p>
    </PageLayout>
  );
}
