
"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('adiShankaracharya_story');

export default function Page() {
  const { locale } = useLocale();
  const ns = useLocaleSection('adiShankaracharya_story');

  const title = ns?.title || 'AdiShankaracharya';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for AdiShankaracharya';

  return (
    <PageLayout
      metaKey="adiShankaracharya_story"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}