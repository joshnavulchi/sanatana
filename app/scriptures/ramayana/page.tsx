/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@/app/components/common/PageLayout';
import styles from '../../styles.module.scss';
import { createGenerateMetadata } from 'lib/pageUtils';
import { t, detectLocale, getLocaleNamespaceObject, getMeta, DEFAULT_LOCALE } from '../../../lib/i18n';
export const generateMetadata = createGenerateMetadata('scriptures_ramayana');

const _localeObj = getLocaleNamespaceObject('en', 'scriptures_ramayana');
const ns = (_localeObj && ((_localeObj as any)['scriptures_ramayana'] || ((_localeObj as any).ramayana) || _localeObj)) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'scriptures_ramayana' ? parts.shift() : 'scriptures_ramayana';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_ramayana', {}, locale) || {};
    const loc: any = getLocaleNamespaceObject(locale, 'scriptures_ramayana') || {};
    const ram = loc?.scriptures_ramayana || {};
    const title = typeof k.title === 'string' ? k.title : (ram.title || __getLoc('scriptures_ramayana.title') || '');
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
      <PageLayout
        metaKey="ramayana"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Ramayana' }]}
        className="layout-md"
      >
        <p><strong>Source: </strong>{page.author} - {page.description ? <span>{page.description}</span> : null}</p>
        {/* Structured display of all ramayana fields */}
        <div>
          {/* Main characters */}
          {page.main_characters && page.main_characters.length > 0 && (
            <div>
              <h2 className="text-2xl md:text-3xl">Main Characters</h2>
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
              <h3 className="text-2xl md:text-3xl">Important Places</h3>
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
              <h4>Timeline</h4>
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
              <h5 className="text-2xl md:text-3xl">Core Themes</h5>
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
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */