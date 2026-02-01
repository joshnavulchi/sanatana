import { getMeta, detectLocale, t } from '../../../lib/i18n';

const ns = useLocaleSection('karna_story');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'karna_story' ? parts.shift() : 'karna_story';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { createGenerateMetadata } from 'lib/pageUtils';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('karna_story');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('karna_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('karna_story.title') || 'Karna')
    };
  })();

  return (
    <PageLayout
      metaKey="karna_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Karna' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/karna</p>
    </PageLayout>
  );
}
