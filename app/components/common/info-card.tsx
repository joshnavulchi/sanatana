"use client";

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { loadLocaleNamespace } from '@lib/i18n';
import { useLocale } from '@app/context/locale-context';
import { useState, useEffect } from 'react';
import LazyImage from '@components/lazyimage';
import Link from 'next/link';

type InfoCardProps = {
  src: string;
  alt: string;
  captionKey: string;
  width?: number;
  height?: number;
};
export default function InfoCard({ src, alt, captionKey, width = 400, height = 300 }: InfoCardProps) {
  const { locale } = useLocale();
  const [loading, setLoading] = useState(true)
  const [caption, setCaption] = useState(captionKey);

  useEffect(() => {
    const resolveKey = async (key: string) => {
      try {
        const parts = key.split('.');
        if (parts.length === 0) return key;
        const namespace = parts[0];
        const ns = await loadLocaleNamespace(locale, namespace);
        if (!ns || typeof ns !== 'object') return key;
        let cur: any = (ns as any)[namespace] || ns;
        for (let i = 1; i < parts.length; i++) {
          if (cur == null) return key;
          cur = cur[parts[i]];
        }
        return typeof cur === 'string' ? cur : key;
      } catch (e) {
        return key;
      }
    };
    resolveKey(captionKey).then(setCaption);
  }, [locale, captionKey]);
  return (
    <div className="relative basis-1/5 p-3 mb-6 md:mb-0 border border-gray-500 bg-white">
      {/* Wrap figure tag inside link next set href to  */}
      <Link href={`/${alt.toLowerCase().trim().replace(" ", "-")}`}>
        <figure>
          {/* Loader */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center /70">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          {/* Image */}
          <LazyImage src={src} alt={alt} width={width} height={height} onLoad={() => setLoading(false)} />
          <figcaption className="text-center">{caption}</figcaption>
        </figure>
      </Link>
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */