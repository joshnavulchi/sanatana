"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import { buildPath, buildIndexPath } from '@lib/vedasUtils';

type VedasData = {
  title?: string;
  description?: string;
  content?: string | Record<string, any>;
  children?: string[];
};

export default function VedasClientRenderer({ initialData, initialLocale, segments }: { initialData: VedasData | null; initialLocale: string; segments: string[] }) {
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
                <li key={c}><Link href={'/vedas/' + [...segments, c].join('/')} className="text-blue-600">{c}</Link></li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
