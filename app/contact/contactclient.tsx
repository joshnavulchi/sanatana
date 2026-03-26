"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { parseMaybeObject, parseList } from '@lib/parse';
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
      <ul className="list-disc pl-5 text-base leading-relaxed">
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
        {heading ? <div className="text-base leading-relaxed font-normal">{heading}</div> : null}
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
            <div key={k} className="classes text-base leading-relaxed font-normal">
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
      <PageLayout metaKey="contact" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Contact' }]} className="layout-md">
        <div className="flex items-center justify-center py-4 text-base leading-relaxed font-normal">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  // Unique two-column card layout
  return (
    <PageLayout metaKey="contact" title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Contact' }]} className="layout-md">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 bg-white/80 rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-100 text-base leading-relaxed font-normal">
        {/* Left info panel */}
        <div className="relative md:w-2/5 flex flex-col justify-between bg-gradient-to-br from-amber-500 via-orange-400 to-amber-600 text-white p-6 md:p-10 gap-4 text-base leading-relaxed font-normal">
          <div>
            <div className="flex items-center gap-4 text-base leading-relaxed font-normal">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md shadow-lg text-base leading-relaxed font-normal">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div>
                <h3 className="text-2xl font-semibold leading-snug mb-3">Contact Us</h3>
                {page.subtitle && <p className="text-white/90 text-base leading-relaxed mb-4 font-normal">{page.subtitle}</p>}
              </div>
            </div>
            <div className="space-y-4 text-base leading-relaxed font-normal">
              {/* Example contact info, replace with dynamic if available */}
              <div className="flex items-center gap-3 text-base leading-relaxed font-normal">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-base leading-relaxed font-normal">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0m8 0V8a4 4 0 10-8 0v4m8 0v4a4 4 0 01-8 0v-4" /></svg>
                </span>
                <span className="text-base leading-relaxed font-normal">support@sanatanadharmam.in</span>
              </div>
              <div className="flex items-center gap-3 text-base leading-relaxed font-normal">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-base leading-relaxed font-normal">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" /></svg>
                </span>
                <span className="text-base leading-relaxed font-normal">@SanatanaDharmaMin</span>
              </div>
              <div className="flex items-center gap-3 text-base leading-relaxed font-normal">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-base leading-relaxed font-normal">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h.01M12 4v16m8-8H4" /></svg>
                </span>
                <span className="text-base leading-relaxed font-normal">www.sanatanadharmam.in</span>
              </div>
            </div>
          </div>
          {/* Social links */}
          <div className="flex gap-4 text-base leading-relaxed font-normal">
            <a href="https://twitter.com/SanatanDharmaMin" target="_blank" rel="noopener" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 transition"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 012 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 007.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0024 4.59a8.36 8.36 0 01-2.54.7z" /></svg></a>
            <a href="https://facebook.com/SanatanDharmaMin" target="_blank" rel="noopener" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 transition"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0" /></svg></a>
            <a href="mailto:support@sanatanadharmam.in" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 transition"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0m8 0V8a4 4 0 10-8 0v4m8 0v4a4 4 0 01-8 0v-4" /></svg></a>
          </div>
        </div>
        {/* Right panel: Contact form */}
        <div className="md:w-3/5 flex flex-col justify-center bg-white text-base leading-relaxed font-normal">
          <ContactForm />
        </div>
      </div>
      {/* FAQ Section */}
      {page.faq && (
        <div className="text-base leading-relaxed font-normal">
          <FaqAccordion items={(Array.isArray(page.faq?.items) ? page.faq.items : (Array.isArray(page.faq) ? page.faq : []))} heading={(page.faq && page.faq.heading) ? page.faq.heading : ''} />
        </div>
      )}
    </PageLayout>
  );
}
