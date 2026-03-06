"use client";
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import PageLayout from '@components/common/PageLayout';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function VisvamitraClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_visvamitra');

  const title = ns?.title || 'Visvamitra';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Visvamitra';

  return (
    <PageLayout
      metaKey="stories_visvamitra"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
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
          <p className="text-xl md:text-lg leading-relaxed">{placeholder}</p>
        </div>
      </div>
    </PageLayout>
  );
}
