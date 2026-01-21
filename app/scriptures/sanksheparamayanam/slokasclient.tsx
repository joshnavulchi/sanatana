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
  const CHUNK = 10;
  const total = Array.isArray(slokas) ? slokas.length : 0;
  const maxVisible = Math.min(100, total);
  const [visible, setVisible] = useState(Math.min(CHUNK, maxVisible));

  const loadMore = () => setVisible((v) => Math.min(v + CHUNK, maxVisible));

  return (
    <div className="sankshepa-slokas">
      {Array.isArray(slokas) && slokas.slice(0, visible).map((s, idx) => (
        <div key={s.sloka || s.sanskrit || idx} className="text-center mt-10">
          {s.sanskrit ? <p className="h5">{s.sanskrit}</p> : null}
          {s.transliteration ? <p className="h5">{s.transliteration}</p> : null}
          {s.meaning ? <p className="text-left">Meaning: {s.meaning}</p> : null}
        </div>
      ))}

      <div className="text-center mt-6">
        <button
          onClick={loadMore}
          disabled={visible >= maxVisible}
          aria-disabled={visible >= maxVisible}
          className={`btn btn-outline cursor-pointer ${visible >= maxVisible ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          {visible >= maxVisible ? 'All loaded' : `Load (${Math.min(CHUNK, maxVisible - visible)} more)`}
        </button>
      </div>
    </div>
  );
}
