"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';

export default function KrishnaClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_krishna');

  const title = ns?.title || 'Krishna';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Krishna';

  return (
    <PageLayout
      metaKey="stories_krishna"
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
