"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function ParvatiClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_parvati');

  const title = ns?.title || 'Parvati';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Parvati';

  return (
    <PageLayout
      metaKey="stories_parvati"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
