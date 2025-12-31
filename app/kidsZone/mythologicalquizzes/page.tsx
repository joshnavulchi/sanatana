/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
import QuizClient from './QuizClient';
export const generateMetadata = createGenerateMetadata('kidsZone_mythologicalquizzes');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('kidsZone_mythologicalquizzes', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('stories..title', locale) || 'Mythological Quizzes')
    };
  })();
  return (
    <>
      <PageLayout metaKey="kidsZone_mythologicalquizzes" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Mythological Quizzes' }]} locale=>
      <QuizClient />
    </PageLayout >
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */