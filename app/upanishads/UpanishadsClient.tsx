"use client";

import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';

interface NavLink { href: string; label: string }

type GenericRecord = Record<string, unknown>;

function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className={`mb-4 last:mb-0 ${className}`}>{p}</p>
      ))}
    </>
  );
}

function KeyTeachingCard({ item, index }: { item: GenericRecord; index: number }) {
  const concept = typeof item.concept === 'string' ? item.concept : '';
  const explanation = typeof item.explanation === 'string' ? item.explanation : '';
  const deepUnderstanding = Array.isArray(item.deep_understanding)
    ? (item.deep_understanding as unknown[]).filter((v) => typeof v === 'string') as string[]
    : [];

  const shells = [
    'bg-linear-to-br from-[#fff8e7] via-[#fff3dc] to-[#ffe8d8]',
    'bg-linear-to-br from-[#fdf3e5] via-[#fdebd2] to-[#f7e8ff]',
    'bg-linear-to-br from-[#fffaf3] via-[#ffece0] to-[#fef6d8]',
  ];

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-[#e7c9a3] p-5 md:p-7 ${shells[index % 3]} transition-all duration-300 hover:-translate-y-0.5`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#b45309]/30 via-[#f59e0b]/20 to-[#d97706]/30" />
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white bg-[#8b4513]">
          {index + 1}
        </span>
        <h3 className="text-xl md:text-2xl font-extrabold text-[#6c2f10]">{concept}</h3>
      </div>
      <div className="text-md sm:text-base text-[#5b341f] leading-relaxed">
        <Paragraphs text={explanation} />
        {deepUnderstanding.length > 0 && (
          <ul className="mt-3 space-y-1.5 list-disc pl-5 marker:text-[#b45309]">
            {deepUnderstanding.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function normalizeNav(nav: unknown, basePath: string): NavLink[] {
  if (nav && typeof nav === 'object' && !Array.isArray(nav)) {
    return Object.entries(nav as Record<string, unknown>)
      .filter(([, val]) => typeof val === 'string')
      .map(([key, val]) => ({
        href: `${basePath}/${key}`,
        label: val as string,
      }));
  }
  return [];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function UpanishadsClient() {
  const { isLoading } = useLocale();
  const shared = useLocaleSection('sharable-strings');
  const pageNs = useLocaleSection('upanishads/index');
  const root = (pageNs && typeof pageNs === 'object' && (pageNs as GenericRecord).upanishads && typeof (pageNs as GenericRecord).upanishads === 'object')
    ? (pageNs as GenericRecord).upanishads as GenericRecord
    : (pageNs as GenericRecord | undefined) || {};

  // Support both locale shapes:
  // 1) { upanishads: { title, ..., meaning, introduction, ... } }
  // 2) { upanishads: { title, ..., upanishads: { meaning, introduction, ... } } }
  const content = (root.upanishads && typeof root.upanishads === 'object')
    ? root.upanishads as GenericRecord
    : root;

  const title = typeof root.title === 'string'
    ? root.title
    : (shared?.footer?.upanishads?.title || 'Upanishads');

  const description = typeof root.description === 'string' ? root.description : '';
  const total = typeof root.total === 'number' ? root.total : null;

  const meaning = typeof content.meaning === 'string' ? content.meaning : '';
  const introduction = typeof content.introduction === 'string' ? content.introduction : '';

  const corePurpose = Array.isArray(content.core_purpose)
    ? (content.core_purpose as unknown[]).filter((v) => typeof v === 'string') as string[]
    : [];

  const keyTeachings = Array.isArray(content.key_teachings)
    ? (content.key_teachings as unknown[]).filter((v) => v && typeof v === 'object') as GenericRecord[]
    : [];

  const mahavakyas = Array.isArray(content.famous_mahavakyas)
    ? (content.famous_mahavakyas as unknown[]).filter((v) => v && typeof v === 'object') as GenericRecord[]
    : [];

  const majorUpanishads = Array.isArray(content.major_upanishads)
    ? (content.major_upanishads as unknown[]).filter((v) => v && typeof v === 'object') as GenericRecord[]
    : [];

  const learningPath = Array.isArray(content.learning_path)
    ? (content.learning_path as unknown[]).filter((v) => typeof v === 'string') as string[]
    : [];

  const modernRelevance = Array.isArray(content.modern_relevance)
    ? (content.modern_relevance as unknown[]).filter((v) => typeof v === 'string') as string[]
    : [];

  const categoryLinks = root.categories && typeof root.categories === 'object'
    ? Object.entries(root.categories as GenericRecord).flatMap(([vedaName, list]) => {
      if (!Array.isArray(list)) return [];
      return (list as unknown[])
        .filter((item) => typeof item === 'string')
        .map((item) => ({ href: `/upanishads/${slugify(String(item))}`, label: String(item), veda: vedaName }));
    })
    : normalizeNav(shared?.footer?.upanishads?.nav, '/upanishads');

  if (isLoading && !pageNs) {
    return (
      <PageLayout metaKey="upanishads/index" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Upanishads' }]} className="layout-md">
        <div className="flex items-center justify-center py-8"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="upanishads/index" title={title} description={description} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
      <div className="space-y-8 rounded-4xl border border-[#efddc8] bg-linear-to-b from-[#fffaf1] via-[#fff7ec] to-[#fff3e4] p-4 md:p-7">
        {meaning && (
          <div className="rounded-3xl border border-[#e7c9a3] bg-[#fff8ec] p-5 md:p-6">
            <h6 className="text-xl md:text-2xl font-bold text-[#6d3414] mb-3">Meaning</h6>
            <p className="text-md sm:text-base leading-relaxed text-[#5a311b]">{meaning}</p>
          </div>
        )}

        {introduction && (
          <div className="relative rounded-3xl border border-[#e7c9a3] bg-white/75 p-5 md:p-7 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#b45309]/30 via-[#f59e0b]/20 to-[#b45309]/30" />
            <h6 className="text-2xl md:text-3xl font-extrabold text-[#6d3414] mb-4">Introduction</h6>
            <div className="text-md sm:text-base leading-relaxed text-[#5a311b]">
              <Paragraphs text={introduction} />
            </div>
          </div>
        )}

        {corePurpose.length > 0 && (
          <div className="rounded-3xl border border-[#e7c9a3] bg-[#fffaf2] p-5 md:p-6">
            <h4 className="text-2xl font-extrabold text-[#6d3414] mb-4">Core Purpose</h4>
            <ul className="space-y-2 list-disc pl-5 marker:text-[#b45309] text-md sm:text-base text-[#5a311b]">
              {corePurpose.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {keyTeachings.length > 0 && (
          <div className="mt-2">
            <h4 className="text-2xl md:text-3xl font-extrabold text-[#6d3414] mb-5">Key Teachings</h4>
            <div className="grid grid-cols-1 gap-5">
              {keyTeachings.map((item, idx) => (
                <KeyTeachingCard key={idx} item={item} index={idx} />
              ))}
            </div>
          </div>
        )}

        {mahavakyas.length > 0 && (
          <div className="rounded-3xl border border-[#e7c9a3] bg-[#fffaf4] p-5 md:p-6">
            <h5 className="text-2xl font-extrabold text-[#6d3414] mb-5">Famous Mahavakyas</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mahavakyas.map((item, idx) => {
                const statement = typeof item.statement === 'string' ? item.statement : '';
                const meaningText = typeof item.meaning === 'string' ? item.meaning : '';
                const simple = typeof item.simple_explanation === 'string' ? item.simple_explanation : '';
                return (
                  <div key={idx} className="rounded-2xl border border-[#f0d2b4] bg-white p-4">
                    <p className="text-lg font-extrabold text-[#6d3414]">{statement}</p>
                    <p className="text-md sm:text-base mt-1 text-[#8b4513] font-semibold">{meaningText}</p>
                    <p className="text-md sm:text-base mt-2 text-[#5a311b]">{simple}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {majorUpanishads.length > 0 && (
          <div className="rounded-3xl border border-[#e7c9a3] bg-[#fffaf2] p-5 md:p-6">
            <h5 className="text-2xl font-extrabold text-[#6d3414] mb-5">Major Upanishads</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {majorUpanishads.map((item, idx) => {
                const name = typeof item.name === 'string' ? item.name : '';
                const focus = typeof item.focus === 'string' ? item.focus : '';
                const simple = typeof item.simple_understanding === 'string' ? item.simple_understanding : '';
                return (
                  <div key={idx} className="rounded-2xl border border-[#f0d2b4] bg-white p-4">
                    <p className="text-lg font-bold text-[#6d3414]">{name}</p>
                    <p className="text-md sm:text-base mt-1 text-[#8b4513]"><span className="font-semibold">Focus:</span> {focus}</p>
                    <p className="text-md sm:text-base mt-2 text-[#5a311b]">{simple}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(learningPath.length > 0 || modernRelevance.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {learningPath.length > 0 && (
              <div className="rounded-3xl border border-[#e7c9a3] bg-white/80 p-5">
                <h6 className="text-xl font-bold text-[#6d3414] mb-3">Learning Path</h6>
                <ol className="list-decimal pl-5 space-y-2 text-md sm:text-base text-[#5a311b] marker:text-[#b45309]">
                  {learningPath.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            )}

            {modernRelevance.length > 0 && (
              <div className="rounded-3xl border border-[#e7c9a3] bg-white/80 p-5">
                <h6 className="text-xl font-bold text-[#6d3414] mb-3">Modern Relevance</h6>
                <ul className="list-disc pl-5 space-y-2 text-md sm:text-base text-[#5a311b] marker:text-[#b45309]">
                  {modernRelevance.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h5 className="text-2xl md:text-3xl font-extrabold text-[#6d3414]">Browse Upanishads</h5>
            {total !== null && (
              <span className="inline-flex items-center rounded-full border border-[#e7c9a3] bg-[#fff0d9] px-3 py-1 text-sm font-semibold text-[#8b4513]">
                Total: {total}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-[#e7c9a3] bg-[#fff8ed] p-5 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#b45309]/30 via-[#f59e0b]/25 to-[#d97706]/30" />
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8b4513]/10 text-md sm:text-base">📜</span>
                    <h6 className="text-md sm:text-base font-semibold text-[#5a311b] transition-colors group-hover:text-[#6d3414]">{link.label}</h6>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

