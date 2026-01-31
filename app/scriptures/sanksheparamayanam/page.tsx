/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@/app/components/common/PageLayout';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import { t, detectLocale, getLocaleObject, getMeta } from '../../../lib/i18n';
import SlokasClient from './slokasclient';
export const generateMetadata = createGenerateMetadata('scriptures_sanksheparamayana');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const loc: any = getLocaleObject(locale) || {};
    const ram = loc?.scriptures_sanksheparamayana || {};
    return {
      title: ram.title || '',
      author: ram.author || '',
      source: ram.source || '',
      description: ram.description || '',
      main_characters: Array.isArray(ram.main_characters) ? ram.main_characters : [],
      important_places: Array.isArray(ram.important_places) ? ram.important_places : [],
      timeline: ram.timeline || [],
      core_themes: ram.core_themes || [],
      slokas: ram.slokas || []
    };
  })();

  return (
    <>
      <PageLayout
        metaKey="sankshepa_ramayana"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
        className="layout-sm"
      >
        <p><strong>Source: </strong>{page.author} - {page.description ? <span>{page.description}</span> : null}</p>
        {/* Structured display of all ramayana fields */}
        <div>
          {/* Main characters */}
          {page.main_characters && page.main_characters.length > 0 && (
            <div>
              <h2 className="h4">Main Characters</h2>
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
              <h3 className="h4">Important Places</h3>
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
              <h5 className="h4">Core Themes</h5>
              <ul role="list" className="list-disc">
                {page.core_themes.map((ct: any, idx: number) => (
                  <li key={idx}>{(typeof ct.title === 'string') ? ct.title : ct['title']}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Sankshepa ramayanam and slokas */}
          <div>
            <SlokasClient slokas={page.slokas || []} />
          </div>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */