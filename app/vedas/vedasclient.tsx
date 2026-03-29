"use client";

import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';

export default function VedasClient({ initialVedas }: { initialVedas?: Record<string, unknown>[] } = {}) {
  const { isLoading } = useLocale();
  const ns = useLocaleSection('vedas');

  const title = ns?.title || 'Vedas';
  const vedas = (initialVedas && initialVedas.length > 0)
    ? initialVedas.map((v) => ({ id: String((v as any).veda || (v as any).id || '' ).toLowerCase(), label: String((v as any).veda || (v as any).label || (v as any).id || '') }))
    : [
      { id: 'rigveda', label: 'Rigveda' },
      { id: 'yajurveda', label: 'Yajurveda' },
      { id: 'samaveda', label: 'Samaveda' },
      { id: 'atharvaveda', label: 'Atharvaveda' },
    ];

  if (isLoading && !ns?.title) {
    return (
      <PageLayout metaKey="vedas" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedas' }]} className="layout-md">
        <div className="py-12 text-center">Loading…</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="vedas" title={title} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
      <div className="space-y-6">
        <h3 className="text-3xl font-semibold">{title}</h3>
        <p className="text-base">Explore the four Vedas below.</p>
        <ul className="space-y-3">
          {vedas.map((v) => (
            <li key={v.id}>
              <Link href={`/vedas/${v.id}`} className="text-amber-800 hover:underline">{v.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </PageLayout>
  );
}
