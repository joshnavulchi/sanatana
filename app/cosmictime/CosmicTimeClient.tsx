"use client";

import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';
import { parseMaybeObject } from '@/lib/parse';
import PageLayout from '@components/common/PageLayout';
import FaqAccordion from '../components/faqaccordion/faqaccordion';

function RenderValue({ value }: { value: any }) {
 if (value === null || value === undefined) return <em className="text-gray-500 text-gray-400 italic">—</em>;

 if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
 return <p className="text-md sm:text-base leading-relaxed text-gray-700 text-gray-200">{String(value)}</p>;
 }

 if (Array.isArray(value)) {
 // Array of primitives
 if (value.every((v) => typeof v !== 'object')) {
 return (
 <ul className="flex flex-wrap gap-3">
 {value.map((item, i) => (
 <li key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 bg-indigo-900/40 text-indigo-200 text-sm font-medium">
 {String(item)}
 </li>
 ))}
 </ul>
 );
 }

 // Array of objects or mixed
 return (
 <div className="space-y-4">
 {value.map((item, i) => (
 <div key={i} className="p-6 border border-transparent rounded-2xl bg-white/80 bg-gray-900/60 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
 <h4 className="text-lg font-semibold mb-2 text-indigo-700 text-indigo-300">Item {i + 1}</h4>
 <RenderValue value={item} />
 </div>
 ))}
 </div>
 );
 }

 if (typeof value === 'object') {
 // Render object as definition list
 return (
 <dl className="grid grid-cols-1 gap-y-4">
 {Object.entries(value).map(([k, v]) => (
 <div key={k} className="flex gap-4 items-start">
 <dt className="font-semibold w-40 text-indigo-700 text-indigo-300 uppercase text-sm">{k.replace(/_/g, ' ')}</dt>
 <dd className="flex-1">
 <RenderValue value={v} />
 </dd>
 </div>
 ))}
 </dl>
 );
 }

 return <pre>{String(value)}</pre>;
}

export default function CosmicTimeClient() {
 const isVisible = true;
 const { locale, isLoading } = useLocale();
 const ns = useLocaleSection('cosmictime');

 // Keep title/description for page metadata but exclude them from in-page rendering
 const pageTitle = String(ns?.title || '');
 const pageDescription = String(ns?.description || '');

 // Build a safe view model from `ns` (exclude meta/openGraph/schema/title/description)
 const filteredKeys = Object.keys(ns || {}).filter(
 (k) => !['meta', 'openGraph', 'schema', 'title', 'description'].includes(k)
 );

 const cosmicTime: Record<string, any> = {};
 for (const k of filteredKeys) {
 cosmicTime[k] = (ns as any)[k];
 }

 // Show loading state if locale is still loading and we have no content
 if (isLoading && !pageTitle) {
 return (
 <PageLayout
 metaKey="cosmictime"
 title={pageTitle}
 breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: pageTitle }]}
 className="layout-md"
 >
 <div className="flex items-center justify-center py-24 bg-gradient-to-b from-indigo-50 to-white from-gray-900/30 rounded-2xl">
 <Loader />
 </div>
 </PageLayout>
 );
 }

 return (
 <>
 <PageLayout
 metaKey="cosmictime"
 title={pageTitle}
 description={pageDescription || ''}
 breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: pageTitle }]}
 className="layout-md"
 >
 {/* Text-to-Speech Player */}
 <TextToSpeech sectionId="cosmictime-content" className="floating" />

 <div id="cosmictime-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-4">
 {/* Render all top-level keys (excluding meta/openGraph/schema) */}
 {Object.entries(cosmicTime).map(([key, value]) => (
 <section
 key={key}
 className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-white/80 to-indigo-50 from-gray-900/60 to-gray-800/30 p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500"
 >
 <h3 className="text-xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
 {key.replace(/_/g, ' ')}
 </h3>
 <div className="prose max-w-none text-md sm:text-base leading-relaxed text-gray-700 text-gray-200">
 <RenderValue value={value} />
 </div>
 </section>
 ))}

 {/* FAQ widget if present */}
 {ns?.faq && (
 <div>
 <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-900 text-white">{ns.faq.heading || 'FAQ'}</h3>
 <FaqAccordion items={parseMaybeObject(ns.faq)?.items || []} heading={ns.faq.heading} />
 </div>
 )}
 </div>
 </PageLayout>
 </>
 );
}
// Content of CosmicTimeClient.tsx can be added here, depending on the actual code. This is just a placeholder.
