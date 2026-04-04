"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DEFAULT_LOCALE } from '@lib/i18n';
import Loader from '@components/loader';
import { fetchContentByRoute } from '@lib/siteUtils';
import { useLocale } from '@app/context/locale-context';
import PageLayout from '@components/common/PageLayout';

type SlugData = Record<string, any> | null;

export default function SlugClient({ initialData, initialLocale, veda, slug, siblings }: { initialData?: SlugData; initialLocale?: string; veda: string; slug: string; siblings?: string[] | null }) {
	const [data, setData] = useState<SlugData>(initialData || null);
	const [loading, setLoading] = useState<boolean>(!initialData);
	const [error, setError] = useState<string | null>(null);

	const { locale: ctxLocale } = useLocale();
	const locale = initialLocale || ctxLocale || DEFAULT_LOCALE;

	function SectionTitle({ children }: any) {
		return <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7c2d12] via-[#c2410c] to-[#f59e0b] mt-4 mb-2">{children}</h2>;
	}
	function Paragraph({ children }: any) {
		return <p className="text-base text-[#5b2d12] leading-relaxed mb-3">{children}</p>;
	}

	function RenderValue({ value, label }: { value: any; label?: string }) {
		if (value === null || value === undefined) return null;

		// Primitive
		if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
			return <Paragraph>{String(value)}</Paragraph>;
		}

		// Array
		if (Array.isArray(value)) {
			// array of strings -> chips
			if (value.every((v) => typeof v === 'string' || typeof v === 'number')) {
				return (
					<div className="flex flex-wrap gap-2">
						{value.map((v, i) => (
							<span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">{String(v)}</span>
						))}
					</div>
				);
			}

			// array of objects -> cards
			return (
				<div className="space-y-3">
					{value.map((item, i) => (
						<div key={i} className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-sm">
							{typeof item === 'object' ? <RenderValue value={item} /> : <Paragraph>{String(item)}</Paragraph>}
						</div>
					))}
				</div>
			);
		}

		// Object
		if (typeof value === 'object') {
			// avoid rendering meta/og/schema/title/description directly
			const excluded = new Set(['meta', 'openGraph', 'schema', 'title', 'description']);
			const entries = Object.entries(value).filter(([k]) => !excluded.has(k));
			if (entries.length === 0) return null;

			// If object looks like a section/hymn with header-like fields, render header then remaining
			const headerKeys = ['section', 'title', 'heading', 'name', 'hymn_number'];
			const headers: any = {};
			const rest: any = {};
			for (const [k, v] of entries) {
				if (headerKeys.includes(k)) headers[k] = v; else rest[k] = v;
			}

			return (
				<div className="mb-4">
					{Object.keys(headers).length > 0 && (
						<div className="mb-2">
							{headers.hymn_number && <h3 className="text-sm font-medium text-gray-600">Hymn {headers.hymn_number}</h3>}
							{headers.title && <h4 className="text-lg font-semibold text-[#7c2d12]">{headers.title}</h4>}
							{headers.section && <h5 className="text-sm text-gray-500">{headers.section}</h5>}
						</div>
					)}
					{Object.entries(rest).map(([k, v]) => (
						<div key={k} className="mt-3">
							<strong className="block text-sm text-gray-700 mb-1">{k.replace(/[-_]/g, ' ')}:</strong>
							<RenderValue value={v} />
						</div>
					))}
				</div>
			);
		}

		return null;
	}

	useEffect(() => {
		if (initialData) return;
		let cancelled = false;
		async function load() {
			setLoading(true);
			setError(null);
			try {
				const res = await fetchContentByRoute(locale, ['vedas', veda, slug]);
				const parsed = res.data as any;
				if (!parsed) {
					if (!cancelled) setError('Content not found');
					return;
				}
				if (!cancelled) setData(parsed);
			} catch (e) {
				if (!cancelled) setError('Content load failed');
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => { cancelled = true; };
	}, [initialData, initialLocale, ctxLocale, locale, veda, slug]);

	// If the JSON uses a nested key (e.g. `{ "mandala-1": { ... } }`) use that object for meta/title
	let mainData: any = data;
	if (data && !data.meta && !data.title) {
		const entries = Object.entries(data || {});
		if (entries.length === 1 && typeof entries[0][1] === 'object') {
			mainData = entries[0][1];
		}
	}

	const title = String(mainData?.meta?.title ?? mainData?.title ?? slug ?? `${veda}`);
	const description = String(mainData?.meta?.description ?? mainData?.description ?? '');
	const metaKey = (mainData?.meta?.key && String(mainData.meta.key)) || `vedas/${veda}/${slug}/index`;

	const breadcrumbs = [
		{ labelKey: 'Home', href: '/' },
		{ label: 'Vedas', href: '/vedas' },
		{ label: veda, href: `/vedas/${veda}` },
		{ label: slug, href: `/vedas/${veda}/${slug}` },
	];

	// Build entries to display, excluding metadata and structural keys
	const displayEntries = Object.entries(mainData || {}).filter(([k]) => !['meta', 'openGraph', 'schema', 'title', 'description', 'introduction'].includes(k));

	if (loading) return (
		<PageLayout metaKey={metaKey} title={title} description={description} breadcrumbs={breadcrumbs} className="layout-md">
			<div className="flex items-center justify-center py-8"><Loader /></div>
		</PageLayout>
	);

	if (error || !data) return (
		<PageLayout metaKey={metaKey} title={title} description={description} breadcrumbs={breadcrumbs} className="layout-md">
			<div className="py-12 text-center text-gray-600">{error || 'Content not available.'}</div>
		</PageLayout>
	);

	return (
		<PageLayout metaKey={metaKey} title={title} description={description} breadcrumbs={breadcrumbs} className="layout-md">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<main className="md:col-span-3">
					{mainData.introduction && <Paragraph>{mainData.introduction}</Paragraph>}

					{displayEntries.map(([k, v]) => (
						<section key={k} className="mb-6">
							<SectionTitle>{k.replace(/_/g, ' ')}</SectionTitle>
							<RenderValue value={v} />
						</section>
					))}
				</main>

				<aside className="md:col-span-1">
					<div className="sticky top-20 bg-white/60 p-3 rounded shadow">
						<h4 className="font-semibold mb-2">Contents</h4>
						<ul className="list-disc pl-5 space-y-1 text-sm">
							{Array.isArray(siblings) && siblings.length > 0 ? (
								siblings.map((s) => (
									<li key={s}>
										<Link href={`/vedas/${veda}/${s}`} className={s === slug ? 'font-semibold text-indigo-700' : 'text-indigo-600'}>{s.replace(/[-_]/g, ' ')}</Link>
									</li>
								))
							) : (
								<li>No other items</li>
							)}
						</ul>
					</div>
				</aside>
			</div>
		</PageLayout>
	);
}
