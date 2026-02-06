"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function ShivaClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_shiva');

  const title = ns?.title || 'Shiva';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Shiva';

  return (
    <PageLayout
      metaKey="stories_shiva"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
