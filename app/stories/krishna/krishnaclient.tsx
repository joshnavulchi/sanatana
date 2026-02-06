"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

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
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
