"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { parseMaybeObject } from '@lib/parseContent';
import { parseList } from '@lib/parseList';
import FaqAccordion from '@components/faqaccordion/faqaccordion';
import ContactForm from '@components/contactform';
import Loader from '@components/loader';

function RenderNode({ node, nodeKey, showHeading }: { node: any; nodeKey?: string; showHeading?: boolean }) {
  if (node === null || node === undefined) return null;
  if (typeof node === 'string') {
    const s = node.trim();
    if (/^(true|false)$/i.test(s)) return null;
    return <p>{node}</p>;
  }
  if (typeof node === 'number' || typeof node === 'boolean') return <p>{String(node)}</p>;
  if (Array.isArray(node)) {
    const items = node
      .filter((it) => !(typeof it === 'string' && /^(true|false)$/i.test(String(it).trim())))
      .map((it, i) => <li key={i}><RenderNode node={it} /></li>);
    if (items.length === 0) return null;
    return (
      <ul className="list-disc">
        {items}
      </ul>
    );
  }
  if (typeof node === 'object') {
    // If this object represents a form (or contains fields), render the ContactForm
    if (node.type === 'form' || Array.isArray(node.fields)) {
      const fields = Array.isArray(node.fields) ? node.fields : undefined;
      const submitButton = node.submitButton || undefined;
      return <ContactForm fields={fields} submitButton={submitButton} />;
    }
    const heading = node.heading || node.title || ((showHeading || false) && nodeKey ? nodeKey : null);
    return (
      <div>
        {heading ? <div className="font-semibold">{heading}</div> : null}
        {Object.keys(node).map(k => {
          if (k === 'heading' || k === 'title' || k === 'id' || k === 'type') return null;
          const child = node[k];
          let classes = "";
          if (child === null || child === undefined) return null;
          if (typeof child === 'string' && /^(true|false)$/i.test(child.trim())) return null;
          // Always render the child's value only (no key labels)
          if (k === "columns") {
            classes = "contact-details";
          }
          return (
            <div key={k} className={classes}>
              <RenderNode node={child} />
            </div>
          );
        })}
      </div>
    );
  }
  return <div>{String(node)}</div>;
}

export default function ContactPage() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('contact');

  // Initialize with empty state to avoid hydration mismatch
  const [page, setPage] = useState<any>({});

  useEffect(() => {
    let mounted = true;
    (() => {
      if (!mounted) return;
      const raw = parseMaybeObject(ns ? ns : '');
      const obj = (raw && typeof raw === 'object') ? raw : (typeof raw === 'string' ? parseMaybeObject(raw) : {});
      // Normalize common list-like fields so client renders like server
      try {
        const transform = (o: any) => {
          if (!o || typeof o !== 'object') return o;
          const out = { ...o };
          for (const k of Object.keys(out)) {
            if (['sections', 'list', 'items', 'columns'].includes(k)) {
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
  }, [locale, ns]);

  if (isLoading && !page.title) {
    return (
      <PageLayout metaKey="contact" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Contact' }]} className={`layout-sm`}>
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout metaKey="contact" title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'contact' }]} className={`layout-sm`}>
      {page.subtitle ? <p className="text-gray-800">{page.subtitle}</p> : null}
      {Object.keys(page).filter(k => !['title', 'subtitle', 'meta', 'schema', 'id', 'type', 'required', 'faq'].includes(k)).map((k) => (
        <div key={k}>
          <RenderNode nodeKey={k} node={page[k]} showHeading={false} />
        </div>
      ))}
      {page.faq && (
        <div className="mt-8">
          <FaqAccordion items={(Array.isArray(page.faq?.items) ? page.faq.items : (Array.isArray(page.faq) ? page.faq : []))} heading={(page.faq && page.faq.heading) ? page.faq.heading : ''} />
        </div>
      )}
    </PageLayout>
  );
}
