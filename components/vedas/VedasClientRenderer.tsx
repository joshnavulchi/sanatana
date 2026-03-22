"use client";

import React from "react";

type Props = {
  data: Record<string, any> | null;
};

"use client";

import React from "react";

type Props = { data: Record<string, any> | null };

const CONTAINER = "max-w-5xl mx-auto px-4 py-6";
const TITLE = "text-3xl md:text-4xl font-semibold text-red-900 mb-4";
const SECTION_TITLE = "text-2xl font-semibold text-red-800 mt-6 mb-2";
const PARAGRAPH = "text-base leading-relaxed mb-4 text-gray-800";
const LIST = "list-disc pl-5 mb-4 text-gray-800";

const EXCLUDED_KEYS = new Set([
  "meta",
  "openGraph",
  "opengraph",
  "schema",
  "canonical",
  "url",
  "keywords",
  "images",
  "publisher",
  "author",
]);

function formatKey(key: string) {
  if (!key) return "";
  return String(key)
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isHtmlString(s: string) {
  return typeof s === "string" && /<[^>]+>/.test(s);
}

function RenderValue({ value }: { value: any }) {
  if (value == null) return null;

  if (typeof value === "string") {
    return isHtmlString(value) ? (
      <div dangerouslySetInnerHTML={{ __html: value }} className={PARAGRAPH} />
    ) : (
      <p className={PARAGRAPH}>{value}</p>
    );
  }

  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) {
      return (
        <ul className={LIST}>
          {value.map((v, i) => (
            <li key={i}>
              {isHtmlString(v) ? (
                <span dangerouslySetInnerHTML={{ __html: v }} />
              ) : (
                String(v)
              )}
            </li>
          ))}
        </ul>
      );
    }

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

  if (typeof value === "object") {
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

  return <p className={PARAGRAPH}>{String(value)}</p>;
}

export default function VedasClientRenderer({ data }: Props) {
  if (!data) return null;

  const doc = data || {};
  const meta = typeof doc.meta === "object" ? doc.meta : {};
  const title = meta.title || doc.title || null;
  const description = meta.description || doc.description || null;

  const intro = typeof doc.introduction === "string" ? doc.introduction : doc.intro ?? null;

  const renderSectionArray = (arr: any[]) => (
    <>
      {arr.map((item, idx) => {
        const heading = item?.section || item?.title || item?.chapter || item?.mandala || null;
        const content = item?.content || item?.scripture_text || item?.introduction || null;
        return (
          <section key={idx}>
            {heading ? <h3 className={SECTION_TITLE}>{String(heading)}</h3> : null}
            {content ? <RenderValue value={content} /> : null}
            {Array.isArray(item?.hymns) && (
              <div className="mt-2">
                <h4 className="text-md font-medium">Hymns</h4>
                <RenderValue value={item.hymns} />
              </div>
            )}
            {Array.isArray(item?.mantras) && (
              <div className="mt-2">
                <h4 className="text-md font-medium">Mantras</h4>
                <RenderValue value={item.mantras} />
              </div>
            )}
          </section>
        );
      })}
    </>
  );

  const deityKeys = Object.keys(doc).filter((k) => /deit|deity|deities/i.test(k) && Array.isArray(doc[k]));

  const mandalaKeys = ["mandalas", "books", "chapters", "samaveda_sections", "yajurveda_chapters", "sections", "section"];

  const otherTopLevelKeys = Object.keys(doc).filter(
    (k) => !EXCLUDED_KEYS.has(k) && k !== "meta" && k !== "title" && k !== "description" && k !== "introduction" && k !== "intro"
  );

  return (
    <main className={CONTAINER}>
      {(title || description) && (
        <header>
          {title && <h1 className={TITLE}>{title}</h1>}
          {description && <p className="text-base text-gray-700 mb-6">{description}</p>}
        </header>
      )}

      {intro && (
        <section>
          <p className={PARAGRAPH}>{intro}</p>
        </section>
      )}

      {Array.isArray(doc.scripture_text) && (
        <section>
          <h2 className={SECTION_TITLE}>Scripture Text</h2>
          {renderSectionArray(doc.scripture_text)}
        </section>
      )}

      {Array.isArray(doc.section) && (
        <section>
          <h2 className={SECTION_TITLE}>Sections</h2>
          {renderSectionArray(doc.section)}
        </section>
      )}

      {Array.isArray(doc.sections) && (
        <section>
          <h2 className={SECTION_TITLE}>Sections</h2>
          {renderSectionArray(doc.sections)}
        </section>
      )}

      {Array.isArray(doc.samaveda_sections) && (
        <section>
          <h2 className={SECTION_TITLE}>Samaveda Sections</h2>
          {renderSectionArray(doc.samaveda_sections)}
        </section>
      )}

      {Array.isArray(doc.yajurveda_chapters) && (
        <section>
          <h2 className={SECTION_TITLE}>Yajurveda Chapters</h2>
          {renderSectionArray(doc.yajurveda_chapters)}
        </section>
      )}

      {mandalaKeys.map((k) => (Array.isArray(doc[k]) ? (
        <section key={k}>
          <h2 className={SECTION_TITLE}>{formatKey(k)}</h2>
          {renderSectionArray(doc[k])}
        </section>
      ) : null))}

      {deityKeys.length > 0 && (
        <section>
          <h2 className={SECTION_TITLE}>Major Deities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {deityKeys.map((k) => (
              <React.Fragment key={k}>
                {doc[k].map((d: any, i: number) => (
                  <div key={k + i} className="p-4 border rounded-lg bg-white shadow-sm">
                    <h3 className="text-lg font-semibold">{d.name || d.title || d.deity}</h3>
                    {d.role && <p className="text-sm text-gray-600">{d.role}</p>}
                    {d.importance && <p className="text-sm text-gray-700 mt-2">{d.importance}</p>}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {Array.isArray(doc.related_concepts) && (
        <section>
          <h2 className={SECTION_TITLE}>Related Concepts</h2>
          <div className="flex flex-wrap gap-2">
            {doc.related_concepts.map((c: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800">{c}</span>
            ))}
          </div>
        </section>
      )}

      {otherTopLevelKeys.map((k) => {
        if (EXCLUDED_KEYS.has(k)) return null;
        if (["scripture_text", "section", "sections", "samaveda_sections", "yajurveda_chapters", "mandalas", "books", "chapters", "related_concepts"].includes(k)) return null;
        const v = doc[k];
        if (v == null) return null;

        return (
          <section key={k} className="mt-6">
            <h2 className={SECTION_TITLE}>{formatKey(k)}</h2>
            <RenderValue value={v} />
          </section>
        );
      })}
    </main>
  );
}
<section key={k} className="mt-6">
