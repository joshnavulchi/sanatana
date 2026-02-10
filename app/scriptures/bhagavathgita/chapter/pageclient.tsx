"use client";
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '@/app/hooks/useLocaleSection';
import Link from 'next/link';
import PageLayout from '@/app/components/common/PageLayout';

export default function BhagavathgitaChapterRootClient() {
  const { locale } = useLocale();
  const ns = useLocaleSection('scriptures_bhagavathgita');
  const chapters = Array.isArray(ns.chapters) ? ns.chapters : [];

  return (
    <PageLayout
      metaKey="scriptures_bhagavathgita"
      title={ns.title || 'Bhagavad Gita'}
      breadcrumbs={[
        { labelKey: 'Home', href: '/' },
        { label: ns.title || 'Bhagavad Gita', href: '/scriptures/bhagavathgita' },
        { label: 'Chapters', href: '#' }
      ]}
      className="layout-sm"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-800 mb-2">All Chapters</h2>
        <p className="text-gray-600 mb-4">Select a chapter to explore its verses and meaning.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {chapters.map((ch: any, idx: number) => (
          <Link
            key={ch.chapter || idx}
            href={`/scriptures/bhagavathgita/chapter/${ch.chapter || idx + 1}`}
            className="block bg-white rounded-xl shadow p-6 border border-amber-100 hover:shadow-lg transition"
          >
            <div className="text-lg font-semibold text-amber-800 mb-1">Chapter {ch.chapter || idx + 1}</div>
            <div className="text-orange-700 font-bold mb-2">{ch.title || ch.name}</div>
            {ch.summary && <div className="text-gray-600 text-sm line-clamp-3">{ch.summary}</div>}
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
