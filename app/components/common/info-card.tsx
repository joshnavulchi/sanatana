/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import LazyImage from '../lazy-image/LazyImage';
import Link from 'next/link';
import { useState } from 'react';
import { useLocale } from '../../context/locale-context';
import { getLocaleObject } from '../../../lib/i18n';
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

  const resolveKey = (key: string) => {
    try {
      const full = getLocaleObject(locale) as any;
      if (!full) return '';
      const parts = key.split('.');
      let cur: any = full;
      for (const p of parts) {
        if (cur == null) return '';
        cur = cur[p];
      }
      return typeof cur === 'string' ? cur : '';
    } catch (e) {
      return '';
    }
  };
  return (
    <div className="info-card relative  basis-1/5 p-3 mb-6 md:mb-0 border border-gray-500">
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
          <figcaption className="text-center">{resolveKey(captionKey) || captionKey}</figcaption>
        </figure>
      </Link>
    </div>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */