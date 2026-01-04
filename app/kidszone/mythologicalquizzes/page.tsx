/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { getMeta, detectLocale, t } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
import QuizClient from './QuizClient';
export const generateMetadata = createGenerateMetadata('mythologicalquizzes_kidszone');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || undefined;
  const page: any = (() => {
    const k: any = getMeta('mythologicalquizzes_kidszone', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('mythologicalquizzes_kidszone..title', locale) || 'Mythological Quizzes')
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="mythologicalquizzes_kidszone"
        title={page.title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Mythological Quizzes' }]}
        className=""
      >
        <QuizClient />
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */