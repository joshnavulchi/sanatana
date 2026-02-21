"use client";
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

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
  // Reading time UI is displayed in all environments (production and development).
  const pending = useRef<number | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const compute = () => {
      const root = selector ? document.querySelector(selector) : document;
      // Prefer innerText to capture only visible text (excludes display:none and many hidden nodes)
      const text = (root instanceof Document)
        ? (root.body?.innerText || '')
        : ((root as HTMLElement)?.innerText ?? (root as HTMLElement)?.textContent ?? '');
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
        try { compute(); } catch (e) { }
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

  // Compute reading time based on words-per-minute (configurable via NEXT_PUBLIC_READING_WPM)
  const wpm = typeof process.env.NEXT_PUBLIC_READING_WPM !== 'undefined'
    ? Math.max(50, Number(process.env.NEXT_PUBLIC_READING_WPM) || 200)
    : 200;
  const totalSeconds = Math.round((total / wpm) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeLabel = minutes > 0 ? `${minutes} min${minutes > 1 ? '' : ''}` : `${seconds} sec`;

  return (
    <span className="bg-white shadow-sm rounded-sm wordcount text-gray-900" role="status" aria-live="polite">
      <span className="label">Read time:</span>
      <span className="value">{timeLabel}</span>
    </span>
  );
}
