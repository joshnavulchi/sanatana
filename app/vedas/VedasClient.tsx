"use client";

import { useEffect, useState } from 'react';
import { DEFAULT_LOCALE, loadLocaleData } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';
import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';

type VedasData = Record<string, any> | null;

export default function VedasClient({ initialData, initialVedas }: { initialData?: VedasData; initialVedas?: Record<string, unknown>[] } = {}) {
 const { isLoading, locale: ctxLocale } = useLocale();
 const [data, setData] = useState<VedasData>(initialData ?? null);
 const [loading, setLoading] = useState<boolean>(!initialData && !initialVedas);
 const [error, setError] = useState<string | null>(null);

 const locale = (ctxLocale || DEFAULT_LOCALE) as string;

 useEffect(() => {
 if (initialData) {
 setData(initialData);
 setLoading(false);
 return;
 }

 if (initialVedas && initialVedas.length > 0) {
 // map initial list into the same shape as locale data
 setData({ scripture_text: initialVedas });
 setLoading(false);
 return;
 }

 let cancelled = false;

 async function load() {
 setLoading(true);
 setError(null);
 try {
 const parsedRoot = await loadLocaleData(locale, 'vedas/index') as Record<string, any>;
 let parsed = (parsedRoot && Object.keys(parsedRoot).length > 0) ? parsedRoot : {} as Record<string, any>;
 if (!parsed || Object.keys(parsed).length === 0) {
 if (!cancelled) setError('Vedas content not found');
 return;
 }

 // If namespace returned { vedas: { ... } } unwrap
 if (parsed.vedas && typeof parsed.vedas === 'object') parsed = parsed.vedas;

 if (!cancelled) setData(parsed || null);
 } catch (e) {
 if (!cancelled) setError('Vedas content not found');
 } finally {
 if (!cancelled) setLoading(false);
 }
 }

 load();
 return () => { cancelled = true; };
 }, [initialVedas, locale]);

 const title = String(data?.meta?.title ?? data?.title ?? 'Vedas');
 const description = String(data?.meta?.description ?? data?.description ?? '');

 if (loading || (isLoading && !data)) {
 return (
 <PageLayout metaKey="vedas/index" title="" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vedas' }]} className="layout-md">
 <div className="py-12 text-center">Loading…</div>
 </PageLayout>
 );
 }

 if (error || !data) {
 return (
 <PageLayout metaKey="vedas/index" title={title} description={description} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
 <div className="py-12 text-center text-gray-600">{error || 'Content not available.'}</div>
 </PageLayout>
 );
 }

 function renderValue(value: any, key?: string | number) {
 if (value === null || value === undefined) return null;
 if (typeof value === 'string' || typeof value === 'number') {
 return <p key={key} className="text-lg sm:text-base text-gray-700 leading-relaxed">{String(value)}</p>;
 }
 if (Array.isArray(value)) {
 return (
 <ul key={key} className="list-disc ml-5 space-y-2 text-lg sm:text-base">
 {value.map((item, index) => (
 <li key={index}>{renderValue(item, index)}</li>
 ))}
 </ul>
 );
 }
 if (typeof value === 'object') {
 const entries = Object.entries(value);
 if (entries.length === 0) return null;
 return (
 <div key={key} className="space-y-3 text-lg sm:text-base">
 {entries.map(([childKey, childValue]) => (
 <div key={childKey}>
 <strong className="block text-gray-900">{childKey.replace(/_/g, ' ')}:</strong>
 {renderValue(childValue, childKey)}
 </div>
 ))}
 </div>
 );
 }
 return null;
 }

 const scriptureList = Array.isArray(data.scripture_text) ? data.scripture_text.map((s: any) => ({ id: (s.veda || '').toLowerCase().replace(/\s+/g, ''), label: s.veda || s.title || 'Veda' })) : [
 { id: 'rigveda', label: 'Rigveda' },
 { id: 'yajurveda', label: 'Yajurveda' },
 { id: 'samaveda', label: 'Samaveda' },
 { id: 'atharvaveda', label: 'Atharvaveda' },
 ];

 return (
 <PageLayout metaKey="vedas/index" title={title} description={description} breadcrumbs={[{ label: 'Home', href: '/' }, { label: title }]} className="layout-md">
 <div className="space-y-6">
 {data.definition && <p className="text-lg sm:text-base">{data.definition}</p>}
 {data.introduction && <div className="prose max-w-none"><p>{data.introduction}</p></div>}

 {Array.isArray(data.scripture_text) && (
 <section className="mt-8">
 <h4 className="text-2xl font-semibold mb-4">Overview</h4>
 <div className="space-y-4">
 {data.scripture_text.map((s: any, idx: number) => (
 <div key={idx} className="p-4 rounded-lg bg-white/60 shadow-sm">
 <h5 className="font-semibold text-lg">{s.veda}</h5>
 {s.description && <p className="text-lg sm:text-base text-gray-700 mt-2">{s.description}</p>}
 {s.primary_focus && <p className="text-lg sm:text-base text-gray-700 mt-2"><strong>Focus:</strong> {s.primary_focus}</p>}
 {s.importance && <p className="text-lg sm:text-base text-gray-700 mt-2"><strong>Importance:</strong> {s.importance}</p>}
 {s.applications && renderValue(s.applications)}
 {s.topics && renderValue(s.topics)}
 {s.structure && renderValue(s.structure)}
 {s.divisions && renderValue(s.divisions)}
 {s.primary_topics && renderValue(s.primary_topics)}
 {s.hymn_count && <p className="text-lg sm:text-base text-gray-700 mt-2"><strong>Hymn count:</strong> {String(s.hymn_count)}</p>}
 </div>
 ))}
 </div>
 </section>
 )}

 {data.meaning_of_word_veda && (
 <section className="mt-6">
 <h4 className="text-xl font-semibold mb-2">Meaning of the word Veda</h4>
 <p className="text-lg sm:text-base">{data.meaning_of_word_veda}</p>
 </section>
 )}

 {data.philosophical_explanation && (
 <section className="mt-6">
 <h4 className="text-xl font-semibold mb-2">Philosophical explanation</h4>
 <div className="prose max-w-none"><p>{data.philosophical_explanation}</p></div>
 </section>
 )}

 {data.structure_text && (
 <section className="mt-6">
 <h4 className="text-xl font-semibold mb-2">Structure text</h4>
 {renderValue(data.structure_text, 'structure_text')}
 </section>
 )}

 {data.estimated_composition_period && (
 <section className="mt-6">
 <h4 className="text-xl font-semibold mb-2">Estimated composition period</h4>
 <dl className="grid grid-cols-1 gap-2">
 {Object.entries(data.estimated_composition_period).map(([k, v]) => (
 <div key={k} className="text-lg sm:text-base">
 <strong className="mr-2">{k.replace(/_/g, ' ')}:</strong>{' '}{String(v)}
 </div>
 ))}
 </dl>
 </section>
 )}

 {data.vedic_society && (
 <section className="mt-6">
 <h4 className="text-xl font-semibold mb-2">Vedic society</h4>
 {data.vedic_society.social_structure && (
 <div>
 <h5 className="font-medium">Social structure</h5>
 <ul className="list-disc ml-5 text-lg sm:text-base">
 {Array.isArray(data.vedic_society.social_structure) && data.vedic_society.social_structure.map((s: any, i: number) => (
 <li key={i}>{s}</li>
 ))}
 </ul>
 </div>
 )}
 </section>
 )}

 {data.influence_of_vedas && (
 <section className="mt-6">
 <h4 className="text-xl font-semibold mb-2">Influence of the Vedas</h4>
 {Object.entries(data.influence_of_vedas).map(([k, arr]) => (
 Array.isArray(arr) ? (
 <div key={k} className="mb-3">
 <h5 className="font-medium">{k.replace(/_/g, ' ')}</h5>
 <ul className="list-disc ml-5 text-lg sm:text-base">
 {(arr as any[]).map((it: any, idx: number) => <li key={idx}>{String(it)}</li>)}
 </ul>
 </div>
 ) : null
 ))}
 </section>
 )}

 {data.vedic_timeline && (
 <section className="mt-6">
 <h4 className="text-xl font-semibold mb-2">Vedic timeline</h4>
 <ul className="list-disc ml-5 text-lg sm:text-base">
 {Object.entries(data.vedic_timeline).map(([k, v]) => (
 <li key={k}><strong className="mr-2">{k.replace(/_/g, ' ')}:</strong>{String(v)}</li>
 ))}
 </ul>
 </section>
 )}

 {data.vedic_philosophical_concepts && (
 <section className="mt-6">
 <h4 className="text-xl font-semibold mb-2">Vedic philosophical concepts</h4>
 <dl className="grid grid-cols-1 gap-2 text-lg sm:text-base">
 {Object.entries(data.vedic_philosophical_concepts).map(([k, v]) => (
 <div key={k}><strong className="mr-2">{k}:</strong>{String(v)}</div>
 ))}
 </dl>
 </section>
 )}

 {Array.isArray(data.related_concepts) && (
 <section className="mt-6">
 <h4 className="text-xl font-semibold mb-2">Related concepts</h4>
 <div className="flex flex-wrap gap-2">
 {data.related_concepts.map((r: any, i: number) => (
 <span key={i} className="text-lg sm:text-base px-2 py-1 bg-gray-100 rounded">{r}</span>
 ))}
 </div>
 </section>
 )}

 {data.structure && (
 <section className="mt-6">
 <div className="rounded-[2rem] bg-gradient-to-br from-amber-50 via-white to-rose-50 from-slate-950 via-slate-900 to-slate-950 border border-gray-200 border-gray-800 shadow-[0_24px_60px_-32px_rgba(245,158,11,0.8)] shadow-[0_24px_60px_-32px_rgba(15,23,42,0.8)] overflow-hidden">
 <div className="px-6 py-5 border-b border-gray-200 border-gray-800 bg-white/80 bg-slate-950/90">
 <h4 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 text-white">Structure summary</h4>
 <p className="mt-2 text-sm sm:text-base text-gray-600 text-gray-400 max-w-2xl">A concise breakdown of the Vedas content structure for fast scanning and reference.</p>
 </div>
 <div className="overflow-x-auto bg-white bg-slate-950">
 <table className="min-w-full border-separate border-spacing-0 text-left text-sm sm:text-base">
 <thead className="bg-gradient-to-r from-amber-100 to-rose-100 from-slate-900 to-slate-800">
 <tr>
 <th className="px-5 py-4 font-semibold text-amber-900 text-amber-300 uppercase tracking-[0.18em]">Section</th>
 <th className="px-5 py-4 font-semibold text-amber-900 text-amber-300 uppercase tracking-[0.18em]">Details</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-200 divide-gray-800">
 {Object.entries(data.structure).map(([k, v]) => (
 <tr key={k} className="transition-colors duration-200 hover:bg-amber-50 hover:bg-slate-900">
 <td className="whitespace-nowrap px-5 py-5 font-semibold text-gray-900 text-gray-100">{k.replace(/_/g, ' ')}</td>
 <td className="px-5 py-5 text-gray-700 text-gray-300 leading-relaxed">
 {typeof v === 'string' || typeof v === 'number' ? (
 String(v)
 ) : Array.isArray(v) ? (
 <div className="grid gap-2">
 {v.map((item: any, idx: number) => (
 <div key={idx} className="rounded-2xl bg-amber-50/80 bg-slate-900 p-3 text-sm text-gray-700 text-gray-300">{renderValue(item, `${k}-${idx}`)}</div>
 ))}
 </div>
 ) : (
 renderValue(v, k)
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </section>
 )}

 {(() => {
 const hiddenKeys = new Set([
 'title', 'definition', 'meta', 'openGraph', 'schema',
 'introduction', 'scripture_text', 'meaning_of_word_veda', 'philosophical_explanation',
 'estimated_composition_period', 'vedic_society', 'influence_of_vedas',
 'vedic_timeline', 'vedic_philosophical_concepts', 'related_concepts', 'structure'
 ]);
 const extraKeys = Object.keys(data).filter((key) => !hiddenKeys.has(key));
 if (extraKeys.length === 0) return null;
 return (
 <section className="mt-6">
 <h4 className="text-xl font-semibold mb-2">Additional Vedas content</h4>
 <div className="space-y-6">
 {extraKeys.map((key) => (
 <div key={key}>
 <h5 className="font-medium capitalize">{key.replace(/_/g, ' ')}</h5>
 {renderValue(data[key], key)}
 </div>
 ))}
 </div>
 </section>
 );
 })()}
 </div>
 </PageLayout>
 );
}

