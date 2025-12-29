/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { detectLocale, t } from '@/lib/i18n';
import { resolveLocaleFromHeaders, createcreateGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
import QuizClient from './QuizClient';
export const generateMetadata = createcreateGenerateMetadata('kidsZone_mythologicalquizzes');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  return (
    <>
      <PageLayout title={S('kidsZone.mythologicalQuizzes.title')} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('kidsZone.mythologicalQuizzes.title')) }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        <p>{S('kidsZone.mythologicalQuizzes.description')}</p>
        <QuizClient />
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */