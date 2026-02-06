"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function ParasuramClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('parasuram_story');

  const title = ns?.title || 'Parasuram';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Parasuram';

  return (
    <PageLayout
      metaKey="parasuram_story"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
