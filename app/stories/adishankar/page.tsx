import { getMeta, detectLocale, t } from '../../../lib/i18n';

const ns = useLocaleSection('adiShankaracharya_story');
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  if (parts[0] === 'adiShankaracharya_story') parts.shift();
  let cur: any = ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { createGenerateMetadata } from 'lib/pageUtils';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('adiShankaracharya_story');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('adiShankaracharya_story', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('adiShankaracharya_story.title') || 'AdiShankaracharya')
    };
  })();

  return (
    <PageLayout
      metaKey="adiShankaracharya_story"
      title={'AdiShankaracharya'}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'AdiShankaracharya' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /stories/adishankar</p>
    </PageLayout>
  );
}