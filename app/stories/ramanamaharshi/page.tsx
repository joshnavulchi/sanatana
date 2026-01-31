import { getMeta, detectLocale, t } from '../../../lib/i18n';

const ns = useLocaleSection('ramanamaharshi_story');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  if (parts[0] === 'ramanamaharshi_story') parts.shift();
  let cur: any = ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { createGenerateMetadata } from 'lib/pageUtils';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('ramanamaharshi_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('ramanamaharshi_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('ramanamaharshi_story.title') || 'Ramanamaharshi')
    };
  })();
  return (
    <PageLayout
      metaKey="ramanamaharshi_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Ramana Maharshi' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/ramanamaharshi</p>
    </PageLayout>
  );
}
