"use client";

import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';

export default function BhagavadGitaChaptersClient() {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('itihasa_bhagavad_gita_structure');
  const title = typeof ns?.title === 'string' ? ns.title : 'Bhagavad Gita';
  const chapters = Array.isArray(ns?.chapters) ? (ns.chapters as unknown[]) : [];

  if (isLoading && chapters.length === 0) {
    return (
      <PageLayout
        metaKey="itihasa_bhagavad_gita_structure"
        title=""
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Itihasa', href: '/itihasa' },
          { label: 'Bhagavad Gita' },
        ]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="itihasa_bhagavad_gita_structure"
      title={title}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Itihasa', href: '/itihasa' },
        { label: 'Bhagavad Gita' },
      ]}
      className="layout-md"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {chapters.map((item, index) => {
          if (!item || typeof item !== 'object') return null;
          const chapterNumber = Number((item as Record<string, unknown>).chapter);
          if (!Number.isFinite(chapterNumber)) return null;
          return (
            <Link
              key={chapterNumber}
              href={`/itihasa/bhagavad-gita/chapter-${chapterNumber}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#d8a25a]/50 bg-[#fffaf0] p-5 shadow-[0_8px_30px_rgba(146,64,14,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(166,61,23,0.18)]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#7a2e1f] via-[#c2410c] to-[#f59e0b]" />
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7a2e1f]/15 text-sm font-bold text-[#7a2e1f]">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-bold text-[#3d2e22] group-hover:text-[#7a2e1f] transition-colors">
                    Chapter {chapterNumber}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </PageLayout>
  );
}
