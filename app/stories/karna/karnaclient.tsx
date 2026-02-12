"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

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
      <p>{placeholder}</p>
    </PageLayout>
  );
}
