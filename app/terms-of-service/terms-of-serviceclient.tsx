"use client";

import { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import { parseSections, parseMaybeObject } from '@lib/parse';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';
import PageLayout from '@components/common/PageLayout';

type PartialPage = Record<string, any>;

export default function TermsOfService({ initialTitle = '' }: { initialTitle?: string }) {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('terms-of-service');

  const [page, setPage] = useState<PartialPage>({ title: initialTitle, lastupdated: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const title = ns?.title || initialTitle;
      const lastupdated = ns?.lastupdated || '';
      const keys = [
        'intro', 'acceptancetitle', 'uselicensetitle', 'uselicensetext', 'uselicenselist',
        'intellectualtitle', 'intellectualtext', 'userconducttitle', 'userconductintro', 'userconductlist',
        'disclaimertitle', 'disclaimertext', 'disclaimerlist', 'disclaimerclosing',
        'liabilitytitle', 'liabilitytext', 'externallinkstitle', 'externallinkstext',
        'modificationstitle', 'modificationstext', 'terminationtitle', 'terminationtext',
        'indemnificationtitle', 'indemnificationtext', 'governingtitle', 'governingtext',
        'severabilitytitle', 'severabilitytext', 'contacttitle', 'contacttext',
        'contactphonelabel', 'contactphone', 'contactemaillabel', 'contactemail', 'contactwebsitelabel', 'contactwebsite', 'closing'
      ];

      const data: PartialPage = {};
      keys.forEach((k) => { data[k] = parseMaybeObject(ns ? ns[k] : ''); });

      ['userconductlist', 'disclaimerlist', 'uselicenselist'].forEach((lk) => {
        const val = data[lk];
        if (typeof val === 'string') data[lk] = parseSections(val);
        else if (Array.isArray(val)) data[lk] = val;
        else if (val && typeof val === 'object') data[lk] = Object.values(val);
        else data[lk] = [];
      });

      setPage({ title, lastupdated, ...data });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !page.title) {
    return (
      <PageLayout metaKey="terms-of-service" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Terms' }]} className="layout-md">
        <div className="flex items-center justify-center py-4 text-md sm:text-base leading-relaxed font-normal"><Loader /></div>
      </PageLayout>
    );
  }

  const renderListItem = (arr: any, idx: number) => {
    if (!arr || !Array.isArray(arr) || idx >= arr.length) return '';
    return arr[idx];
  };

  return (
    <PageLayout
      metaKey="terms-of-service"
      title={page.title}
      description={page.intro}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
      className="layout-md">
      <div className="space-y-8 text-md sm:text-base leading-relaxed font-normal" id="terms-of-service-content">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 text-md sm:text-base leading-relaxed font-normal">
          <div className="flex items-center gap-3 text-md sm:text-base leading-relaxed font-normal">
            <span className="text-md sm:text-base leading-relaxed font-normal">📋</span>
            <strong className="text-xl md:text-md sm:text-base">{page.lastupdated}</strong>
          </div>
          <TextToSpeech sectionId="terms-of-service-content" />
        </div>

        {/* Disclaimer */}
        <section>
          <h6 className="text-lg font-semibold">{page.disclaimertitle}</h6>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{page.disclaimertext}</p>
          <ul role="list" className="space-y-3 list-disc pl-5 text-md sm:text-base leading-relaxed">
            {[0, 1, 2, 3].map((i) => {
              const item = renderListItem(page.disclaimerlist, i);
              return item ? (
                <li key={i} className="flex items-start gap-3 mb-2">
                  <span className="shrink-0 w-2 h-2 rounded-full text-md sm:text-base leading-relaxed font-normal" />
                  <span className="flex-1 text-md sm:text-base leading-relaxed font-normal">{item}</span>
                </li>
              ) : null;
            })}
          </ul>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{page.disclaimerclosing}</p>
        </section>

        {/* Other sections in card format */}
        {[
          { icon: '⚖️', title: page.liabilitytitle, text: page.liabilitytext },
          { icon: '🔗', title: page.externallinkstitle, text: page.externallinkstext },
          { icon: '🔄', title: page.modificationstitle, text: page.modificationstext },
          { icon: '🚫', title: page.terminationtitle, text: page.terminationtext },
          { icon: '🛡️', title: page.indemnificationtitle, text: page.indemnificationtext },
          { icon: '🏛️', title: page.governingtitle, text: page.governingtext },
          { icon: '📑', title: page.severabilitytitle, text: page.severabilitytext },
        ].map((section, idx) => (
          <section key={idx} className="bg-white rounded-2xl p-4 md:p-8 shadow-lg">
            <p className="flex items-center gap-3 text-md sm:text-base leading-relaxed mb-4 font-normal">
              <span className="text-md sm:text-base leading-relaxed font-normal">{section.icon}</span>
              {section.title}
            </p>
            <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{section.text}</p>
          </section>
        ))}

        {/* Contact section */}
        <section className="rounded-2xl p-4 md:p-8">
          <p className="flex items-center gap-3 text-md sm:text-base leading-relaxed mb-4 font-normal">
            <span className="text-md sm:text-base leading-relaxed font-normal">📞</span>
            {page.contacttitle}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{page.contacttext}</p>
          <div className="space-y-2 text-md sm:text-base leading-relaxed font-normal">
            <p><strong className="text-amber-800">{page.contactphonelabel}</strong> {page.contactphone}</p>
            <p><strong className="text-amber-800">{page.contactemaillabel}</strong> {page.contactemail}</p>
            <p><strong className="text-amber-800">{page.contactwebsitelabel}</strong> <a href="https://sanatanadharmam.in" className="text-amber-800 hover:text-orange-700 underline transition-colors">{page.contactwebsite}</a></p>
          </div>
          <p className="pt-4 text-md sm:text-base leading-relaxed mb-4 font-normal">{page.closing}</p>
        </section>
      </div>
    </PageLayout>
  );
}

