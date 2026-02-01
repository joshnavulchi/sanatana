import { getMeta, detectLocale, t } from '../../../lib/i18n';

const ns = useLocaleSection('parvati_story');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'parvati_story' ? parts.shift() : 'parvati_story';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { createGenerateMetadata } from 'lib/pageUtils';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('parvati_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('parvati_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('parvati_story.title') || 'Parvathi')
    };
  })();
  return (
    <PageLayout
      metaKey="parvati_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Parvati' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/parvati</p>
    </PageLayout>
  );
}
