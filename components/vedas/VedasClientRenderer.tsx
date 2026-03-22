"use client";

import React from "react";

type Props = {
  data: Record<string, any> | null;
};

const EXCLUDED_KEYS = new Set<string>([
  "meta",
  "openGraph",
  "schema",
  "canonical",
  "url",
  "keywords",
  "images",
  "publisher",
  "author",
]);

const PHILOSOPHY_KEYS = [
  "philosophical explanation",
  "philosophicalExplanation",
  "philosophical_explanation",
  "philosophy",
  "philosophical",
];

function findFirstStringKey(data: Record<string, any>, keys: string[]) {
  for (const k of keys) {
    if (typeof data?.[k] === "string") return { key: k, value: data[k] as string };
  }
  return null;
}

export default function VedasClientRenderer({ data }: Props) {
  if (!data) return null;

  const title = data?.meta?.title ?? data?.title ?? null;
  const description = data?.meta?.description ?? data?.description ?? null;

  const intro = typeof data?.introduction === "string" ? data.introduction : null;

  const sectionArray = Array.isArray(data?.section) ? (data.section as any[]) : [];

  const philosophyFound = findFirstStringKey(data, PHILOSOPHY_KEYS);
  const philosophy = philosophyFound ? philosophyFound.value : null;

  const renderedValues = new Set<string>();
  if (title) renderedValues.add(title);
  if (description) renderedValues.add(description);
  if (intro) renderedValues.add(intro);
  if (philosophy) renderedValues.add(philosophy);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {(title || description) && (
        <header>
          {title ? (
            <h1 className="text-3xl md:text-4xl font-semibold text-red-900 mb-4">
              {title}
            </h1>
          ) : null}

          {description ? (
            <p className="text-base text-gray-700 mb-6">{description}</p>
          ) : null}
        </header>
      )}

      {intro && (
        <section>
          <p className="text-base text-gray-800 leading-relaxed mb-4">{intro}</p>
        </section>
      )}

      {sectionArray.length > 0 && (
        <>
          {sectionArray.map((item, idx) => {
            const secTitle = typeof item?.section === "string" ? item.section : null;
            const secContent = typeof item?.content === "string" ? item.content : null;

            if (secTitle && renderedValues.has(secTitle)) return null;
            if (secContent && renderedValues.has(secContent)) return null;

            if (secTitle) renderedValues.add(secTitle);
            if (secContent) renderedValues.add(secContent);

            return (
              <section key={idx}>
                {secTitle ? (
                  <h2 className="text-2xl font-semibold text-red-800 mb-3 mt-6">{secTitle}</h2>
                ) : null}

                {secContent ? (
                  <p className="text-base text-gray-800 leading-relaxed mb-4">{secContent}</p>
                ) : null}
              </section>
            );
          })}
        </>
      )}

      {philosophy && (
        <section>
          <h2 className="text-2xl font-semibold text-red-800 mb-3 mt-6">Philosophical Insights</h2>
          <p className="text-base text-gray-800 leading-relaxed mb-4">{philosophy}</p>
        </section>
      )}

      {Object.keys(data).map((key) => {
        if (EXCLUDED_KEYS.has(key)) return null;
        if (key === "meta") return null;
        if (key === "section" || key === "introduction") return null;
        if (philosophyFound && key === philosophyFound.key) return null;

        const val = data[key];
        if (typeof val !== "string") return null;
        if (renderedValues.has(val)) return null;

        renderedValues.add(val);
        return (
          <section key={key}>
            <p className="text-base text-gray-800 leading-relaxed mb-4">{val}</p>
          </section>
        );
      })}
    </main>
  );
}
"use client";

import React from 'react';

type Props = {
  data: Record<string, any>;
};

const CONTAINER = 'max-w-5xl mx-auto px-4 py-6';
const TITLE = 'text-3xl font-semibold mb-4';
const SECTION_TITLE = 'text-2xl font-semibold mt-6 mb-2';
const PARAGRAPH = 'text-base leading-relaxed mb-4 text-gray-800';
const LIST = 'list-disc pl-5 mb-4';

function formatKey(key: string) {
  if (!key) return '';
  return String(key)
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isHtmlString(s: string) {
  return typeof s === 'string' && /<[^>]+>/.test(s);
}

function RenderValue({ value }: { value: any }) {
  if (value == null) return null;

  if (typeof value === 'string') {
    return isHtmlString(value) ? (
      <div dangerouslySetInnerHTML={{ __html: value }} className={PARAGRAPH} />
    ) : (
      <p className={PARAGRAPH}>{value}</p>
    );
  }

  if (Array.isArray(value)) {
    // If array of strings, render as list of HTML/paragraphs
    if (value.every(v => typeof v === 'string')) {
      return (
        <ul className={LIST}>
          {value.map((v, i) => (
            <li key={i} dangerouslySetInnerHTML={isHtmlString(v) ? { __html: v as string } : undefined}>
              {!isHtmlString(v) ? String(v) : null}
            </li>
          ))}
        </ul>
      );
    }

    // Mixed/objects: render each item recursively
    return (
      <div className="space-y-4">
        {value.map((item, i) => (
          <div key={i} className="pl-2">
            <RenderValue value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div className="space-y-4">
        {Object.keys(value).map((k) => (
          <div key={k} className="mb-3">
            <h4 className="text-md font-medium mb-1">{formatKey(k)}</h4>
            <RenderValue value={value[k]} />
          </div>
        ))}
      </div>
    );
  }

  // number, boolean, etc.
  return <p className={PARAGRAPH}>{String(value)}</p>;
}

export default function VedasClientRenderer({ data }: Props) {
  const doc = data || {};

  // Prefer meta.title as main heading if present
  const meta = typeof doc.meta === 'object' ? doc.meta : {};
  const title = meta.title || doc.title || null;

  // Keys to exclude from generic rendering
  const excluded = new Set(['meta', 'opengraph', 'schema']);

  // Determine order: introduction, sections, then other keys
  const intro = doc.introduction || doc.intro || null;
  const sections = Array.isArray(doc.sections) ? doc.sections : null;

  const otherKeys = Object.keys(doc).filter(k => !excluded.has(k) && k !== 'introduction' && k !== 'intro' && k !== 'sections' && k !== 'title' && k !== 'meta');

  return (
    <div className={CONTAINER}>
      {title && <h1 className={TITLE}>{title}</h1>}

      {intro && (
        <div>
          <p className={PARAGRAPH}>{intro}</p>
        </div>
      )}

      {sections && (
        <div>
          {sections.map((s, idx) => (
            <section key={idx}>
              {s && (s.section || s.title) && <h2 className={SECTION_TITLE}>{formatKey(s.section || s.title)}</h2>}
              {s && s.content && <RenderValue value={s.content} />}
            </section>
          ))}
        </div>
      )}

      {otherKeys.map((k) => (
        <section key={k} className="mt-6">
          <h2 className={SECTION_TITLE}>{formatKey(k)}</h2>
          <RenderValue value={doc[k]} />
        </section>
      ))}
    </div>
  );
}
