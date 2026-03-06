"use client";
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import PageLayout from '@components/common/PageLayout';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function ParasuramClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('parasuram_story');

  const title = ns?.title || 'Parasuram';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Parasuram';

  return (
    <PageLayout
      metaKey="parasuram_story"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl border-l-4 border-emerald-500 shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-xl md:text-lg leading-relaxed">{placeholder}</p>
        </div>
      </div>
    </PageLayout>
  );
}
