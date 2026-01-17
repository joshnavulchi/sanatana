"use client";
import React, { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { useT } from '../hooks/useT';
import { parseMaybeObject } from 'lib/parseContent';
import { parseList } from 'lib/parseList';
import FaqAccordion from '../components/faqaccordion/faqaccordion';

function RenderNode({ node, nodeKey, showHeading }: { node: any; nodeKey?: string; showHeading?: boolean }) {
  if (node === null || node === undefined) return null;
  if (typeof node === 'string') return <p>{node}</p>;
  if (typeof node === 'number' || typeof node === 'boolean') return <p>{String(node)}</p>;
  if (Array.isArray(node)) return (
    <ul className="list-disc">
      {node.map((it, i) => <li key={i}><RenderNode node={it} /></li>)}
    </ul>
  );
  if (typeof node === 'object') {
    const heading = node.heading || node.title || ((showHeading || false) && nodeKey ? nodeKey : null);
    return (
      <section>
        {heading ? <p>{heading}</p> : null}
        {Object.keys(node).map(k => {
          if (k === 'heading' || k === 'title' || k === 'id' || k === 'type') return null;
          const child = node[k];
          if (child === null || child === undefined) return null;
          // Always render the child's value only (no key labels)
          return (
            <div key={k} className="mb-4">
              <RenderNode node={child} />
            </div>
          );
        })}
      </section>
    );
  }
  return <p>{String(node)}</p>;
}

export default function ContactPage() {
  const { locale } = useLocale();
  const t = useT();
  const [page, setPage] = useState<any>({});

  useEffect(() => {
    let mounted = true;
    (() => {
      if (!mounted) return;
      const raw = parseMaybeObject(t('contact'));
      const obj = (raw && typeof raw === 'object') ? raw : (typeof raw === 'string' ? parseMaybeObject(raw) : {});
      // Normalize common list-like fields so client renders like server
      try {
        const transform = (o: any) => {
          if (!o || typeof o !== 'object') return o;
          const out = { ...o };
          for (const k of Object.keys(out)) {
            if (['sections','list','items','columns'].includes(k)) {
              out[k] = parseList(out[k]);
            }
          }
          return out;
        };
        setPage(transform(obj) || {});
      } catch (e) {
        setPage(obj || {});
      }
    })();
    return () => { mounted = false; };
  }, [locale]);

  return (
    <PageLayout metaKey="contact" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title || 'contact' }]} className="layout-sm">
      {page.subtitle ? <p>{page.subtitle}</p> : null}
      {Object.keys(page).filter(k => !['title','subtitle','meta','schema','id','type'].includes(k)).map((k) => (
        <div key={k} className="mb-6">
          {k === 'faq' ? (
            <FaqAccordion items={(Array.isArray(page[k]?.items) ? page[k].items : (Array.isArray(page[k]) ? page[k] : []))} heading={(page[k] && page[k].heading) ? page[k].heading : ''} />
          ) : (
            <RenderNode nodeKey={k} node={page[k]} showHeading={false} />
          )}
        </div>
      ))}
    </PageLayout>
  );
}
