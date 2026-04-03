/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { DEFAULT_LOCALE } from '@lib/i18n';
import { fetchContentByRoute } from '@lib/siteUtils';
import { createGenerateMetadata } from '@lib/pageUtils';
import { notFound } from 'next/navigation';

import SlugClient from './SlugClient';

// For static export we must provide all params at build time.
export async function generateStaticParams() {
	const locale = DEFAULT_LOCALE;
	const vedas = ['rigveda', 'yajurveda', 'samaveda', 'atharvaveda'];
	const params: Array<{ veda: string; slug: string }> = [];

	if (typeof window === 'undefined') {
		try {
			const fs = require('fs');
			const path = require('path');
			for (const v of vedas) {
				const vPath = path.join(process.cwd(), 'public', 'data', 'locales', String(locale), 'vedas', v);
				if (!fs.existsSync(vPath)) continue;
				const children = fs.readdirSync(vPath, { withFileTypes: true })
					.filter((d: any) => d.isDirectory())
					.map((d: any) => String(d.name))
					.filter(Boolean);

				for (const c of children) {
					const idx = path.join(vPath, c, 'index.json');
					if (fs.existsSync(idx)) {
						params.push({ veda: v, slug: c });
					}
				}
			}
		} catch (e) {
			// If filesystem access fails, return a small default set so build doesn't break
			return vedas.flatMap((v) => [{ veda: v, slug: 'index' }]);
		}
	}

	return params;
}

export async function generateMetadata({ params, searchParams }: { params?: { veda?: string; slug?: string } | Promise<any>; searchParams?: any }) {
	// `params` may sometimes be a thenable or undefined depending on Next internals.
	let resolvedParams: any = params;
	try {
		if (resolvedParams && typeof resolvedParams.then === 'function') {
			resolvedParams = await resolvedParams;
		}
	} catch (e) {
		resolvedParams = undefined;
	}

	const v = resolvedParams?.veda;
	const s = resolvedParams?.slug;
	const key = v && s ? `vedas/${v}/${s}/index` : (v ? `vedas/${v}/index` : 'vedas');
	return await createGenerateMetadata(key)({ searchParams });
}

export default async function Page({ params }: { params: { veda?: string; slug?: string } | Promise<{ veda?: string; slug?: string }> }) {
	let resolved: { veda?: string; slug?: string } | undefined = params as any;
	try {
		if (resolved && typeof (resolved as any).then === 'function') resolved = await (resolved as any);
	} catch (e) {
		resolved = undefined;
	}

	const veda = typeof resolved?.veda === 'string' ? resolved.veda : undefined;
	const slug = typeof resolved?.slug === 'string' ? resolved.slug : undefined;
	if (!veda || !slug) return notFound();

	const locale = DEFAULT_LOCALE;

	// fetch the slug content
	const fetched = await fetchContentByRoute(locale, ['vedas', veda, slug]);
	const data = fetched && fetched.data ? (fetched.data as any) : null;
	if (!data) return notFound();

	// attempt to fetch parent index to collect siblings (if parent exposes children)
	const parent = await fetchContentByRoute(locale, ['vedas', veda]);
	const siblings = parent && parent.data && parent.data.children ? (parent.data.children as string[]) : null;

	return <SlugClient initialData={data} initialLocale={locale} veda={veda} slug={slug} siblings={siblings} />;
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */