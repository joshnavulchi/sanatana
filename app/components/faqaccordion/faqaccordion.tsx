"use client";
import { useState } from 'react';

type FaqItem = {
  q: string;
  a: string;
};

type Props = {
  items: FaqItem[];
  heading?: string;
};

export default function FaqAccordion({ items, heading }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="faq-accordion">
      {heading && <p className="h4">{heading}</p>}
      <div className="space-y-3">
        {items.map((it, idx) => {
          const open = openIndex === idx;
          return (
            <div key={idx} className="border rounded-md overflow-hidden">
              <button
                aria-expanded={open}
                aria-controls={`faq-${idx}`}
                onClick={() => setOpenIndex(open ? null : idx)}
                className="w-full btn text-left flex justify-between items-center"
              >
                <span className="font-medium">{it.q}</span>
                <span className="ml-4 text-xl">{open ? '−' : '+'}</span>
              </button>
              <div
                id={`faq-${idx}`}
                role="region"
                className={`px-4 pb-4 transition-max-h duration-300 ${open ? 'max-h-96' : 'max-h-0'} overflow-hidden`}
              >
                <div className="pt-3 text-gray-800 whitespace-pre-line">{it.a}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
