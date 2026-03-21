"use client";
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { safeString } from '@lib/i18n';
import Loader from '@components/loader';

function parseNum(value: unknown): number {
  if (typeof value !== 'string') return Number.NaN;
  return Number(value.match(/(\d+)$/)?.[1] || '1');
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className="mb-4 last:mb-0">{p}</p>
      ))}
    </>
  );
}

export default function ItemClient({ slug, chapter, item }: { slug: string; chapter: string; item: string }) {
  const { isLoading } = useLocale();
  const chapterNum = parseNum(chapter);
  const itemNum = parseNum(item);

  const rigvedaNs = useLocaleSection(slug === 'rigveda' ? `vedas_rigveda_madala${chapterNum}` : '');
  const yajurNs = useLocaleSection(slug === 'yajurveda' ? 'vedas_yajurveda_structure' : '');
  const atharvaNs = useLocaleSection(slug === 'atharvaveda' ? 'vedas_atharvaveda_structure' : '');

  const vedaTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const chapterLabel = chapter.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const itemLabel = item.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  let entry: Record<string, unknown> | undefined;
  let detailLabel = 'Hymn';

  if (slug === 'rigveda') {
    const hymns = Array.isArray(rigvedaNs?.hymns) ? rigvedaNs.hymns : [];
    entry = hymns.find((h: Record<string, unknown>) => Number(h.hymn_number) === itemNum);
    detailLabel = 'Hymn';
  }

  if (slug === 'yajurveda') {
    const root = (yajurNs?.yajurveda ?? yajurNs) as Record<string, unknown>;
    const chapters = Array.isArray(root?.chapters) ? root.chapters : [];
    const selected = chapters.find((c: Record<string, unknown>) => Number(c.chapter) === chapterNum) as Record<string, unknown> | undefined;
    const mantras = Array.isArray(selected?.mantras) ? selected.mantras : [];
    entry = mantras.find((m: Record<string, unknown>) => Number(m.mantra_number) === itemNum);
    detailLabel = 'Mantra';
  }

  if (slug === 'atharvaveda') {
    const root = (atharvaNs?.atharvaveda ?? atharvaNs) as Record<string, unknown>;
    const books = Array.isArray(root?.books) ? root.books : [];
    const selected = books.find((b: Record<string, unknown>) => Number(b.book) === chapterNum) as Record<string, unknown> | undefined;
    const hymns = Array.isArray(selected?.hymns) ? selected.hymns : [];
    entry = hymns.find((h: Record<string, unknown>) => Number(h.hymn_number) === itemNum);
    detailLabel = 'Hymn';
  }

  const title = safeString(entry?.title, `${vedaTitle} ${chapterLabel} ${itemLabel}`);
  const introduction = safeString(entry?.introduction, '');
  const scriptureText = safeString(entry?.scripture_text, '');
  const philosophicalExplanation = safeString(entry?.philosophical_explanation, '');

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Vedas', href: '/vedas' },
    { label: vedaTitle, href: `/vedas/${slug}` },
    { label: chapterLabel, href: `/vedas/${slug}/${chapter}` },
    { label: `${detailLabel} ${itemNum}` },
  ];

  if (isLoading && !entry) {
    return (
      <PageLayout metaKey="vedas" title="" breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="vedas" title={title} breadcrumbs={breadcrumbs} className="layout-md">
      <section className="rounded-3xl border border-amber-200/30 bg-amber-50 p-6 md:p-10">
        <h1 className="page-title mb-3">{title}</h1>
        <p className="meta-text">{chapterLabel} • {detailLabel} {itemNum}</p>
      </section>

      {introduction && (
        <section className="mt-8 rounded-2xl border border-amber-200/30 bg-amber-50 p-5 md:p-6">
          <h2 className="section-title">Introduction</h2>
          <div className="body-text"><Paragraphs text={introduction} /></div>
        </section>
      )}

      {scriptureText && (
        <section className="mt-6 rounded-2xl border border-amber-200/50 bg-amber-50 p-5 md:p-6">
          <h2 className="section-title">Scripture Text</h2>
          <div className="body-text"><Paragraphs text={scriptureText} /></div>
        </section>
      )}

      {philosophicalExplanation && (
        <section className="mt-6 rounded-2xl border border-amber-200/30 bg-amber-50 p-5 md:p-6">
          <h2 className="section-title">Philosophical Significance</h2>
          <div className="body-text"><Paragraphs text={philosophicalExplanation} /></div>
        </section>
      )}

      <nav className="mt-8 flex items-center justify-between gap-4">
        {itemNum > 1 ? (
          <Link href={`/vedas/${slug}/${chapter}/${item.replace(/\d+$/, String(itemNum - 1))}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            ← {detailLabel} {itemNum - 1}
          </Link>
        ) : <span />}

        <Link href={`/vedas/${slug}/${chapter}`} className="text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700">
          Back to {chapterLabel}
        </Link>

        <Link href={`/vedas/${slug}/${chapter}/${item.replace(/\d+$/, String(itemNum + 1))}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          {detailLabel} {itemNum + 1} →
        </Link>
      </nav>
    </PageLayout>
  );
}
