"use client";
import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from './wordCount.module.scss';

export interface WordCountProps {
  selector?: string;
  debounce?: number;
  hideWhenZero?: boolean;
  minUniqueThreshold?: number;
}

function countFromText(text: string) {
  const s = String(text).trim();
  if (!s) return 0;
  // normalize by replacing punctuation with spaces, preserving Unicode letters/numbers
  const normalized = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  return normalized.split(/\s+/).filter(Boolean).length;
}

export default function WordCountDisplay({ selector, debounce = 250, hideWhenZero = true, minUniqueThreshold = 800 }: WordCountProps) {
  const [total, setTotal] = useState<number>(0);
  const [unique, setUnique] = useState<number>(0);
  // Only display the word count UI in development to avoid exposing internals in production
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) return null;
  const pending = useRef<number | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const compute = () => {
      const root = selector ? document.querySelector(selector) : document;
      const text = root instanceof Document ? (root.body?.textContent || '') : ((root as Element)?.textContent || '');
      const tcount = countFromText(text);
      setTotal(tcount);
      const normalized = String(text).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ');
      const arr = normalized.split(/\s+/).filter(Boolean);
      setUnique(new Set(arr).size);
    };

    const debounced = () => {
      if (pending.current) window.clearTimeout(pending.current);
      pending.current = window.setTimeout(() => {
        pending.current = null;
        compute();
      }, debounce);
    };

    compute();

    const mo = new MutationObserver(debounced);
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    observerRef.current = mo;

    window.addEventListener('visibilitychange', debounced);
    window.addEventListener('resize', debounced);

    // Ensure we compute once after all resources and subresources finish loading
    const onLoad = () => {
      try {
        compute();
      } catch (e) {
        // swallow errors from compute to avoid breaking page
      }
    };
    if (document.readyState !== 'complete') {
      window.addEventListener('load', onLoad);
    } else {
      // already complete — run compute once more to catch late-rendered content
      setTimeout(() => {
        try { compute(); } catch (e) {}
      }, 0);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (pending.current) window.clearTimeout(pending.current);
      window.removeEventListener('visibilitychange', debounced);
      window.removeEventListener('resize', debounced);
      window.removeEventListener('load', onLoad);
    };
  }, [selector, debounce, pathname]);

  if (hideWhenZero && total === 0) return null;

  const showUnique = total >= (minUniqueThreshold || 0);
  const label = showUnique ? 'Unique words:' : 'Words:';
  const value = showUnique ? unique : total;

  return (
    <div className={styles.wordcount} role="status" aria-live="polite">
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
