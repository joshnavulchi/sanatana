import { getMeta, detectLocale, t } from '../../../lib/i18n';

const ns = useLocaleSection('lakshmi_story');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  if (parts[0] === 'lakshmi_story') parts.shift();
  let cur: any = ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { createGenerateMetadata } from 'lib/pageUtils';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('lakshmi_story');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('lakshmi_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('lakshmi_story.title') || 'Lakshmi')
    };
  })();
  return (
    <PageLayout
      metaKey="lakshmi_story"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Lakshmi' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/lakshmi</p>
    </PageLayout>
  );
}
