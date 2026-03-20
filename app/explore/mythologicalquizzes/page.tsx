/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

const ns: Record<string, unknown> = {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'kidszone_mythologicalquizzes' ? parts.shift() : 'kidszone_mythologicalquizzes';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};
import { t, DEFAULT_LOCALE } from '@lib/i18n';
import { createGenerateMetadata } from '@lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
import QuizClient from './QuizClient';
export const generateMetadata = createGenerateMetadata('kidszone_mythologicalquizzes');
export default function Page({ searchParams }: any) {
  const locale = DEFAULT_LOCALE;
  const page: any = (() => {
    const k: any = t('kidszone_mythologicalquizzes', locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('kidszone_mythologicalquizzes.title') || 'Mythological Quizzes')
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="kidszone_mythologicalquizzes"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Mythological Quizzes' }]}
        className="layout-md"
      >
        <QuizClient />
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */