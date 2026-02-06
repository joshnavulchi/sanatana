"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function BramhaClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_brahma');

  const title = ns?.title || 'Brahma';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Brahma';

  return (
    <PageLayout
      metaKey="stories_brahma"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
