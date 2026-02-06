"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function RamanamaharshiClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_ramanamaharshi');

  const title = ns?.title || 'Ramana Maharshi';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Ramana Maharshi';

  return (
    <PageLayout
      metaKey="stories_ramanamaharshi"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
