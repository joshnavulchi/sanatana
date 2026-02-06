"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function VisvamitraClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_visvamitra');

  const title = ns?.title || 'Visvamitra';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Visvamitra';

  return (
    <PageLayout
      metaKey="stories_visvamitra"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
