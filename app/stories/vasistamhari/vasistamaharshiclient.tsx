"use client";
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import PageLayout from '@components/common/PageLayout';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function VasistamaharshiClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_vasistamhari');

  const title = ns?.title || 'Vasista Maharshi';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Vasista Maharshi';

  return (
    <PageLayout
      metaKey="stories_vasistamhari"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className="md"
    >
      <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600" />
            <span className="text-3xl animate-pulse">🛕</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600" />
          </div>
          <p className="text-md leading-relaxed">{placeholder}</p>
        </div>
      </div>
    </PageLayout>
  );
}
