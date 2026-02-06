"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function SaraswatiClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_saraswati');

  const title = ns?.title || 'Saraswati';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Saraswati';

  return (
    <PageLayout
      metaKey="stories_saraswati"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
