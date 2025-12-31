/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";

import { useRef, useEffect, useState } from 'react';
import { useT } from '../../hooks/useT';
import { parseList } from 'lib/parseList';

export default function KrishnaStotram() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const t = useT();

  const titleLines: any = parseList(t("home.krishnaStotram.title"));
  const transliteration: string = t("home.krishnaStotram.transliteration") as string;
  const credit: string = t("home.krishnaStotram.credit") as string;
  const translation: string = t("home.krishnaStotram.translation") as string;

  return (
    <section ref={ref} className="bg-white" >
      <div className="content-wrapper krishna-stotram text-center">
        <h2 className="multi-text-color">
          {Array.isArray(titleLines) ? (
            titleLines.map((ln: string, idx: number) => (
              <span key={idx}>{ln} </span>
            ))
          ) : (
            <span>{String(titleLines)}</span>
          )}
        </h2>
        <p>
          <span>{transliteration}</span>
          <strong>{credit} </strong>
        </p>
        <p>{translation}</p>
      </div>
    </section>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
