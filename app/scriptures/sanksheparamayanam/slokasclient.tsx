"use client";
import React, { useState } from 'react';

type Sloka = {
  sloka?: string;
  sanskrit?: string;
  transliteration?: string;
  meaning?: string;
  [k: string]: any;
};

export default function SlokasClient({ slokas }: { slokas: Sloka[] }) {
  const CHUNK = 25;
  const total = Array.isArray(slokas) ? slokas.length : 0;
  const maxVisible = Math.min(100, total);
  const [visible, setVisible] = useState(Math.min(CHUNK, maxVisible));

  const loadMore = () => setVisible((v) => Math.min(v + CHUNK, maxVisible));

  return (
    <div className="sankshepa-slokas">
      {Array.isArray(slokas) && slokas.slice(0, visible).map((s, idx) => (
        <div key={s.sloka || s.sanskrit || idx} className="text-center mt-10">
          {s.sanskrit ? <p className="text-2xl md:text-3xl/20 font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-amber-300 dark:via-yellow-400 dark:to-orange-300">{s.sanskrit}</p> : null}
          {s.transliteration ? <p className="text-xl font-bold dark:text-amber-100 mb-3">{s.transliteration}</p> : null}
          {s.meaning ? <p className="text-xl font-light dark:text-amber-100 mb-6 text-left">{s.meaning}</p> : null}
        </div>
      ))}

      <div className="text-center mt-6">
        <button
          onClick={loadMore}
          disabled={visible >= maxVisible}
          aria-disabled={visible >= maxVisible}
          className={`group relative md:inline-flex px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600
                    hover:from-amber-600 hover:to-orange-700 text-white text-lg rounded-full shadow-xl hover:shadow-2xl
                    transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden cursor-pointer ${visible >= maxVisible ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          <span className="relative flex items-center justify-center gap-2">
            {visible >= maxVisible ? 'All loaded' : `Load (${Math.min(CHUNK, maxVisible - visible)} more)`}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
