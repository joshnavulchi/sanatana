"use client";

import { useLocale } from '@app/context/locale-context';
import { t, getMeta } from '@lib/i18n';
import PageLayout from '@components/common/PageLayout';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function DailyPrayersClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('stostrasmantras_dailyprayers', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : 'Daily Prayers',
      items: Array.isArray(k.items) ? k.items : []
    };
  })();

  return (
    <PageLayout
      metaKey="stostrasmantras_dailyprayers"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
      className="layout-md"
    >
      <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl border-l-4 border-emerald-500 shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500" />
            <span className="text-3xl animate-pulse">📖</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500" />
          </div>
          <p className="text-md leading-relaxed">
            Placeholder for daily prayers and short mantras.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
