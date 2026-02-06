"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function VasistamaharshiClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_vasistamhari');

  const title = ns?.title || 'Vasista Maharshi';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Vasista Maharshi';

  return (
    <PageLayout
      metaKey="stories_vasistamhari"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
