"use client";
import { useLocale } from '../../context/locale-context';
import { t, getMeta } from '../../../lib/i18n';
import { parseList } from 'lib/parseList';
import PageLayout from '@/app/components/common/PageLayout';

export default function HanumanClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('stotrasmantras_hanuman', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : 'Hanuman Stotras',
      items: Array.isArray(k.items) ? k.items : parseList('')
    };
  })();
  const items = page.items || [];
  return (
    <PageLayout
      metaKey="stotrasmantras_hanuman"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
      className=""
    >
      {items.map((item: any, i: number) => (
        <section key={i}>
          <h2 className="h4">{item.name || item.title || `Item ${i + 1}`}</h2>
        </section>
      ))}
    </PageLayout>
  );
}
