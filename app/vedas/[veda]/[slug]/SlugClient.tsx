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

	function renderContent(content: any, key?: number | string) {
		if (content === null || content === undefined) return null;
		if (typeof content === 'string' || typeof content === 'number') return <Paragraph key={key}>{String(content)}</Paragraph>;
		if (Array.isArray(content)) return <div key={key} className="space-y-2">{content.map((c, i) => <div key={i}>{renderContent(c, i)}</div>)}</div>;
		if (typeof content === 'object') {
			if (content.section || content.title || content.heading) {
				return (
					<div key={key} className="mb-3">
						{content.section && <h3 className="text-lg font-semibold mb-1">{content.section}</h3>}
						{content.title && <h3 className="text-lg font-semibold mb-1">{content.title}</h3>}
						{content.heading && <h3 className="text-lg font-semibold mb-1">{content.heading}</h3>}
						{renderContent(content.content ?? content.introduction ?? content.text ?? content.body)}
					</div>
				);
			}
			const entries = Object.entries(content);
			if (entries.length === 0) return null;
			return (
				<div key={key} className="mb-2">
					{entries.map(([k, v], i) => (
						<div key={i}>
							<strong className="mr-2">{k}:</strong>
							{renderContent(v, i)}
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

	const title = String(data?.meta?.title ?? data?.title ?? slug ?? `${veda}`);
	const description = String(data?.meta?.description ?? data?.description ?? '');
	const metaKey = (data?.meta?.key && String(data.meta.key)) || `vedas/${veda}/${slug}/index`;

	const breadcrumbs = [
		{ labelKey: 'Home', href: '/' },
		{ label: 'Vedas', href: '/vedas' },
		{ label: veda, href: `/vedas/${veda}` },
		{ label: slug, href: `/vedas/${veda}/${slug}` },
	];

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
					{data.introduction && <Paragraph>{data.introduction}</Paragraph>}

					{Object.entries(data).map(([k, v]) => (
						k === 'meta' || k === 'introduction' ? null : (
							<section key={k} className="mb-6">
								<SectionTitle>{k.replace(/_/g, ' ')}</SectionTitle>
								{renderContent(v)}
							</section>
						)
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
