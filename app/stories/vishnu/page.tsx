import { getMeta, detectLocale, t } from '../../../lib/i18n';

const ns = useLocaleSection('vishnu_story');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'vishnu_story' ? parts.shift() : 'vishnu_story';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { createGenerateMetadata } from 'lib/pageUtils';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('vishnu_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('vishnu_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('vishnu_story.title') || 'Vishnu')
    };
  })();
  return (
    <PageLayout
      metaKey="vishnu_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Vishnu' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/vishnu</p>
    </PageLayout>
  );
}
