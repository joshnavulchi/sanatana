"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';

export default function LakshmiClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_lakshmi');

  const title = ns?.title || 'Lakshmi';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Lakshmi';

  return (
    <PageLayout
      metaKey="stories_lakshmi"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
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
