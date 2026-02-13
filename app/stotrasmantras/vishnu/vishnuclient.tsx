"use client";
import { useLocale } from '../../context/locale-context';
import { t, getMeta } from '../../../lib/i18n';
import { parseList } from 'lib/parseList';
import PageLayout from '@/app/components/common/PageLayout';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';

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
    <PageLayout
      metaKey="stotrasmantras_vishnu"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
      className="layout-md"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl border-l-4 border-emerald-500 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500" />
                <span className="text-3xl animate-pulse">📖</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500" />
              </div>
              {items.map((item: any, i: number) => (
                <section key={i} className="mb-8 p-6 bg-white/80 border border-emerald-100 rounded-xl shadow-sm">
                  <h2 className="text-2xl md:text-3xl text-emerald-700 font-bold mb-3 tracking-wide">{item.name || item.title || `Item ${i + 1}`}</h2>
                </section>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/4">
          <div className="sticky top-24">
            <SimilarCategories currentCategory="stotrasmantras" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
