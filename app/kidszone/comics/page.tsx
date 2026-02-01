import { getMeta, detectLocale, t } from '../../../lib/i18n';

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'kidszone_mythologycomics' ? parts.shift() : 'kidszone_mythologycomics';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('kidszone_mythologycomics');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('kidszone_mythologycomics', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('kidszone_mythologycomics.title') || 'Comics')
    };
  })();
  return (
    <PageLayout
      metaKey="kidszone_mythologycomics"
      title={'Mythology Comics'}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Mythology Comics' }]}
      className=""
    >
      <p>Placeholder page generated from locales/en/nav.json for path /kidszone/comics</p>
    </PageLayout>
  );
}
