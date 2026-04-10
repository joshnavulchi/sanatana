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
    <section className="faq-accordion my-12 bg-gradient-to-br from-amber-50 via-pink-50 to-rose-100 rounded-2xl shadow-xl p-6 animate-fadeInUp">
      {heading && (
        <div className="mb-8 text-center">
          <h6 className="text-3xl font-semibold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text inline-block">
            {heading}
          </h6>
          <div className="mt-3 w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
        </div>
      )}
      <div className="space-y-4 max-w-4xl mx-auto">
        {items.map((it, idx) => {
          const open = openIndex === idx;
          return (
            <div
              key={idx}
              className={`
                  group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 bg-gradient-to-br from-white via-amber-50 to-pink-50
                  ${open
                  ? 'border-pink-400 shadow-2xl shadow-pink-500/20 animate-fadeInUp'
                  : 'border-amber-200 shadow-md hover:shadow-lg hover:border-amber-300 animate-fadeIn'
                }
                `}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${open
                ? 'from-pink-50 via-amber-50 to-rose-100 opacity-100 animate-gradient-x'
                : 'from-white to-amber-50/30 opacity-100'
                }`} />

              {/* Decorative corner accent */}
              {open && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-full pointer-events-none" />
              )}

              <button
                aria-expanded={open}
                aria-controls={`faq-${idx}`}
                onClick={() => setOpenIndex(open ? null : idx)}
                className="relative w-full text-left flex justify-between items-start gap-4 p-3 z-10"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-md sm:text-base font-bold transition-all duration-300
                    ${open
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white scale-110 shadow-2xl animate-pulse'
                      : 'bg-amber-100 text-amber-700 group-hover:scale-105'
                    }
                  `}>
                    {idx + 1}
                  </div>
                  <span className={`text-md sm:text-base leading-relaxed transition-colors duration-300
                    ${open
                      ? 'text-amber-900 '
                      : 'text-gray-800  group-hover:text-amber-700 '
                    }
                  `}>
                    {it.q}
                  </span>
                </div>
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform
                  ${open
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rotate-180 shadow-xl animate-bounce'
                    : 'bg-amber-100 text-amber-800  group-hover:bg-amber-200 '
                  }
                `}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                id={`faq-${idx}`}
                role="region"
                className={`
                  relative z-10 overflow-hidden transition-all duration-500 ease-in-out
                  ${open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="px-6 pl-20">
                  <div className="pt-2 leading-relaxed whitespace-pre-line border-l-4 border-amber-400 pl-6 py-3 bg-white/50 /50 rounded-r-lg">
                    {it.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

