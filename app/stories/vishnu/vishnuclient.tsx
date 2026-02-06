"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function VishnuClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_vishnu');

  const title = ns?.title || 'Vishnu';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Vishnu';

  return (
    <PageLayout
      metaKey="stories_vishnu"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
