"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';

export default function KarnaClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_karna');

  const title = ns?.title || 'Karna';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Karna';

  return (
    <PageLayout
      metaKey="stories_karna"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className="layout-md"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <p>{placeholder}</p>
        </div>
        <div className="w-full lg:w-1/4">
          <div className="sticky top-24">
            <SimilarCategories currentCategory="stories" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
