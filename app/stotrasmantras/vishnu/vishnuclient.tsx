"use client";
import { useLocale } from '@app/context/locale-context';
import { t, getMeta } from '@lib/i18n';
import { parseList } from '@lib/parseList';
import PageLayout from '@components/common/PageLayout';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function VishnuClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('stotrasmantras_vishnu', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : 'Vishnu Stotras',
      items: Array.isArray(k.items) ? k.items : parseList('')
    };
  })();
  const items = page.items || [];
  return (
    <PageLayout metaKey="stotrasmantras_vishnu"
      title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
      className="layout-md">
      <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600" />
            <span className="text-3xl animate-pulse">🛕</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600" />
          </div>
          {items.map((item: any, i: number) => (
            <section key={i} className="mb-8 p-6 bg-white/80 border border-amber-100 rounded-xl shadow-sm">
              <h2 className="text-2xl md:text-3xl text-amber-700 font-bold mb-3 tracking-wide">{item.name || item.title || `Item ${i + 1}`}</h2>
            </section>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
