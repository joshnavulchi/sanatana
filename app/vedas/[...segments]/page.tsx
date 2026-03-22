import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { detectServerLocaleFromHeaders } from '@lib/i18n';
import { buildPath, buildIndexPath } from '@lib/vedasUtils';

// Client renderer uses useLocale to re-resolve locale on the client and
// re-fetch content if the client-selected locale differs from the server one.
"use client";
import React, { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';

type VedasData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
};

function VedasClientRenderer({ initialData, initialLocale, segments }: { initialData: VedasData | null; initialLocale: string; segments: string[] }) {
  const { locale } = useLocale();
  const [data, setData] = useState<VedasData | null>(initialData);
  useEffect(() => {
    let mounted = true;
    async function maybeRefetch() {
      const clientLocale = locale || initialLocale;
      if (!clientLocale) return;
      if (clientLocale === initialLocale) return;
      try {
        const path = buildPath(clientLocale, segments);
        let res = await fetch(path);
        if (!res.ok) {
          const idx = buildIndexPath(clientLocale, segments);
          res = await fetch(idx);
        }
        if (!res.ok) return;
        const parsed = await res.json();
        if (mounted) setData(parsed ?? null);
      } catch (e) {
        // ignore client-side fetch errors
      }
    }
    maybeRefetch();
    return () => { mounted = false; };
  }, [locale, initialLocale, segments]);

  if (!data) return <div>Content not available</div>;

  return (
    <article>
      <h1 className="text-2xl font-semibold">{data?.title ?? 'Untitled'}</h1>
      {data?.description ? <p className="mt-2 text-gray-700">{data.description}</p> : null}
      <div className="mt-4 prose">
        {typeof data.content === 'string' ? (
          <div>{data.content}</div>
        ) : data.content ? (
          <pre className="whitespace-pre-wrap">{JSON.stringify(data.content, null, 2)}</pre>
        ) : (
          <div>Content not available</div>
        )}

        {Array.isArray((data as any).children) && (data as any).children.length > 0 ? (
          <div className="mt-4">
            <h3>Children</h3>
            <ul>
              {((data as any).children as string[]).map((c) => (
                <li key={c}><Link href={"/vedas/" + [...segments, c].join('/')} className="text-blue-600">{c}</Link></li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}

// The server-side component (default export) is a thin wrapper that fetches
// the JSON using server-detected locale and renders the client renderer.
export default async function Page({ params }: { params: { segments?: string[] } }) {
  const segments = Array.isArray(params?.segments) ? params.segments : [];
  if (!segments || segments.length === 0) return notFound();

  const hdrs = headers();
  const locale = detectServerLocaleFromHeaders(hdrs) || 'en';

  // Try file first
  const filePath = buildPath(locale, segments);
  let res = await fetch(filePath, { cache: 'force-cache' } as any);
  let data: VedasData | null = null;
  if (res.ok) {
    try { data = await res.json(); } catch (e) { data = null; }
  } else {
    // treat as folder: try index.json inside folder
    const idxPath = buildIndexPath(locale, segments);
    res = await fetch(idxPath, { cache: 'force-cache' } as any);
    if (res.ok) {
      try { data = await res.json(); } catch (e) { data = null; }
    }
  }

  if (!data) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-4">
      <VedasClientRenderer initialData={data} initialLocale={locale} segments={segments} />
    </main>
  );
}

export async function generateMetadata({ params, searchParams }: any) {
  const segments = Array.isArray(params?.segments) ? params.segments : [];
  const locale = (searchParams && (searchParams.locale || searchParams.lang)) || 'en';
  let data: any = null;
  try {
    const p = buildPath(locale, segments);
    let r = await fetch(p, { cache: 'force-cache' } as any);
    if (!r.ok) {
      const i = buildIndexPath(locale, segments);
      r = await fetch(i, { cache: 'force-cache' } as any);
    }
    if (r.ok) data = await r.json();
  } catch (e) {
    data = null;
  }

  const title = data?.title ?? 'Vedas';
  const description = data?.description ?? '';
  const canonical = `/vedas/${segments.join('/')}`;

  return {
    title,
    description,
    alternates: { canonical },
  } as any;
}
