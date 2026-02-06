"use client";
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';

export default function MoralStoriesClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('stories_moralstories');

  const title = ns?.title || 'Moral Stories';
  const homeLabel = ns?.home || 'Home';
  const placeholder = ns?.placeholder || 'Placeholder page for Moral Stories';

  return (
    <PageLayout
      metaKey="stories_moralstories"
      title={title}
      breadcrumbs={[{ label: homeLabel, href: '/' }, { label: title }]}
      className=""
    >
      <p>{placeholder}</p>
    </PageLayout>
  );
}
