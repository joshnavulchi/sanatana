/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getLocaleObject, getMeta } from '../../../lib/i18n';
import { resolveLocaleFromHeaders, createcreateGenerateMetadata } from 'lib/pageUtils';
export const generateMetadata = createcreateGenerateMetadata('scriptures_ramayana');
export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_ramayana', {}, locale) || {};
    const loc: any = getLocaleObject(locale) || {};
    const ram = loc?.ramayana || {};
    const title = typeof k.title === 'string' ? k.title : (ram.title || t('ramayana.title', locale) || '');
    const author = k.source || ram.source || '';
    let description: string = '';
    const descSource = k.description || ram.description;
    if (typeof descSource === 'string') description = descSource;
    else if (descSource && typeof descSource === 'object') description = descSource[locale] || descSource['translate'] || '';
    return {
      title,
      author,
      description,
      main_characters: Array.isArray(k.main_characters) ? k.main_characters : (Array.isArray(ram.main_characters) ? ram.main_characters : []),
      important_places: Array.isArray(k.important_places) ? k.important_places : (Array.isArray(ram.important_places) ? ram.important_places : []),
      timeline: Array.isArray(k.timeline) ? k.timeline : (Array.isArray(ram.timeline) ? ram.timeline : []),
      core_themes: Array.isArray(k.core_themes) ? k.core_themes : (Array.isArray(ram.core_themes) ? ram.core_themes : []),
      full_ramayana: k.full_ramayana || ram.full_ramayana || undefined
    };
  })();
  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <h2>{page.title}</h2>
        <p><strong>Source: </strong>{page.author} - {page.description ? <span>{page.description}</span> : null}</p>
        {/* Structured display of all ramayana fields */}
        <div>
          {/* Main characters */}
          {page.main_characters && page.main_characters.length > 0 && (
            <div>
              <h3>Main Characters</h3>
              <ul role="list" className="list-disc">
                {page.main_characters.map((c: any, idx: number) => (
                  <li key={idx}>
                    <strong>{c.name}</strong> - {c.role ? <span>{c.role}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Important places */}
          {page.important_places && page.important_places.length > 0 && (
            <div>
              <h4>Important Places</h4>
              <ul role="list" className="list-disc">
                {page.important_places.map((p: any, idx: number) => (
                  <li key={idx}>
                    <strong>{p.name}</strong> - {p.desc ? <span>{p.desc}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Timeline */}
          {page.timeline && page.timeline.length > 0 && (
            <div>
              <h5>Timeline</h5>
              <ol role="list" className="list-disc">
                {page.timeline.map((ev: any, idx: number) => (
                  <li key={idx}>
                    <strong>{ev.event}</strong> - {ev.desc ? <span>{ev.desc}</span> : null}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {/* Core themes */}
          {page.core_themes && page.core_themes.length > 0 && (
            <div>
              <h6>Core Themes</h6>
              <ul role="list" className="list-disc">
                {page.core_themes.map((ct: any, idx: number) => (
                  <li key={idx}>{(typeof ct.title === 'string') ? ct.title : ct['title']}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Full ramayana kandas and sargas */}
          {page.full_ramayana && typeof page.full_ramayana === 'object' && (
            <div>
              <p>Ramayana (Kandas & Sargas)</p>
              {Object.keys(page.full_ramayana).map((kkey: string, index: number) => {
                const kanda = (page.full_ramayana as any)[kkey];
                if (!kanda) return null;
                return (
                  <div key={kkey}>
                    {kanda.kanda ? <p>{index + 1}. {kanda.kanda}</p> : <p>{kkey}</p>}
                    <div>
                      {kanda.description ? <p>{(typeof kanda.description === 'string') ? kanda.description : null}</p> : null}
                      {Array.isArray(kanda.sargas) && kanda.sargas.length > 0 && (
                        <div>
                          <ul role="list" className="list-disc">
                            {kanda.sargas.map((s: any) => (
                              <li key={s.sarga}>
                                <span>{s.title}</span>
                                {s.story ? <p><strong>Story: </strong>{(typeof s.story === 'string') ? s.story : null}</p> : null}
                                {s.lesson ? <p><strong>Lesson: </strong>{(typeof s.lesson === 'string') ? s.lesson : null}</p> : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */