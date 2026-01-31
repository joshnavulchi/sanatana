/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';

import { useState, useEffect } from 'react';
type LocaleIndex = Record<string, any>;

function findWorldTransitionObject(locale: LocaleIndex) {
  // Common possibilities: top-level keys or nested under pages/sections
  if (!locale) return null;
  // direct key variants
  const candidates = [
    'world-transition',
    'worldTransition',
    'world_transition',
    'worldtransition',
  ];

  for (const key of candidates) {
    if (key in locale) return locale[key];
  }

  // search a few likely namespaces
  if (locale.pages && locale.pages['world-transition']) return locale.pages['world-transition'];
  if (locale.sections && locale.sections['world-transition']) return locale.sections['world-transition'];

  // fallback: try to read nav label
  if (locale.others?.nav?.['world-transition']) {
    return { title: locale.others.nav['world-transition'] };
  }

  return null;
}

function deepFindKey(obj: any, keys: string[]): any | null {
  if (!obj || typeof obj !== 'object') return null;
  for (const k of Object.keys(obj)) {
    if (keys.includes(k)) return obj[k];
  }
  for (const k of Object.keys(obj)) {
    try {
      const v = obj[k];
      if (v && typeof v === 'object') {
        const found = deepFindKey(v, keys);
        if (found != null) return found;
      }
    } catch (_) {
      // ignore
    }
  }
  return null;
}

// Load the heavy map JSON at runtime to avoid bundling/parsing it during initial page load

export default function WorldTransitionContent() {
  const [locale, setLocale] = useState<LocaleIndex | null>(null);
  const [pageContent, setPageContent] = useState<any>(null);
  const [selectedDecade, setSelectedDecade] = useState<number | null>(0);

  return (
    <main style={{ width: "100%" }}>
      <div style={{ padding: '1rem 0' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 1rem' }}>
          {/* Render locale-provided page content flexibly */}
          {typeof pageContent === 'string' ? (
            <>
              <h1 style={{ margin: 0 }}>{pageContent}</h1>
            </>
          ) : pageContent && typeof pageContent === 'object' ? (
            <>
              <h1 style={{ margin: 0 }}>{pageContent.meta?.title ?? pageContent.title ?? pageContent.heading ?? locale?.others?.nav?.['world-transition'] ?? 'World Transition'}</h1>
              {pageContent.meta?.description && <p style={{ marginTop: 8 }}>{pageContent.meta.description}</p>}

              {pageContent.intro && <p style={{ marginTop: 8 }}>{pageContent.intro}</p>}
              {pageContent.description && <p style={{ marginTop: 8 }}>{pageContent.description}</p>}

              {/* Render legend if provided (simple visual) */}
              {pageContent.legend && pageContent.legend.changeTypes && Array.isArray(pageContent.legend.changeTypes) && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Legend</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {pageContent.legend.changeTypes.map((ct: any) => (
                      <div key={ct.key} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.6)', padding: '6px 8px', borderRadius: 6 }}>
                        <span style={{ width: 18, height: 12, background: ct.color || '#999', display: 'inline-block', borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }} />
                        <span style={{ fontSize: 13 }}>{ct.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Render decades list if present */}
              {pageContent.decades && Array.isArray(pageContent.decades) && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Decades</div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>Found {pageContent.decades.length} decades</div>
                    {pageContent.decades.map((d: any, idx: number) => (
                      <div key={d.key ?? d.decade ?? d.label ?? idx} style={{ padding: 8, background: 'rgba(255,255,255,0.9)', borderRadius: 6, boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
                        <div style={{ fontWeight: 600 }}>{d.decade ?? d.label ?? d.title ?? `Decade ${idx + 1}`}</div>
                        {d.theme && <div style={{ marginTop: 6, fontStyle: 'italic' }}>{d.theme}</div>}
                        {d.summary && <div style={{ marginTop: 6 }}>{d.summary}</div>}
                        {d.whatChanged && Array.isArray(d.whatChanged) && (
                          <ul style={{ marginTop: 8 }}>
                            {d.whatChanged.map((w: string, i: number) => <li key={i}>{w}</li>)}
                          </ul>
                        )}
                        {d.why && Array.isArray(d.why) && (
                          <div style={{ marginTop: 6 }}>
                            <strong>Why:</strong>
                            <ul>
                              {d.why.map((w: string, i: number) => <li key={i}>{w}</li>)}
                            </ul>
                          </div>
                        )}
                        {/* decade map controls */}
                        {d.svgOverlay && (
                          <div style={{ marginTop: 8 }}>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                              <input type="checkbox" checked={selectedDecade === idx} onChange={() => setSelectedDecade(selectedDecade === idx ? null : idx)} />
                              <span style={{ fontSize: 13 }}>{selectedDecade === idx ? 'Shown on map' : 'Show on map'}</span>
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Render any other simple string fields for convenience */}
              {Object.keys(pageContent).map((k) => (
                (['title', 'intro', 'description', 'heading', 'meta', 'legend', 'decades'].includes(k) || typeof (pageContent as any)[k] !== 'string') ? null : (
                  <p key={k} style={{ marginTop: 8 }}><strong>{k}:</strong> {(pageContent as any)[k]}</p>
                )
              ))}
            </>
          ) : (
            <>
              <h1 style={{ margin: 0 }}>{locale?.others?.nav?.['world-transition'] ?? 'World Transition'}</h1>
            </>
          )}
        </div>
      </div>
    </main>
  );
}