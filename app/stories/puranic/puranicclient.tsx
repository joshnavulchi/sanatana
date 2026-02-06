"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function PuranicClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_puranic');

  const title = ns?.title || 'Puranic';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Puranic';

  return (
    <PageLayout
      metaKey="stories_puranic"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
