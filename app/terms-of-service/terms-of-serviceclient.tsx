"use client";

import { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import { parseSections, parseMaybeObject } from '@lib/parse';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';
import PageLayout from '@components/common/PageLayout';

type PartialPage = Record<string, any>;

export default function TermsOfService() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('terms_of_service');

  // Initialize with empty state to avoid hydration mismatch
  // useLocaleSection will populate the data properly
  const [page, setPage] = useState<PartialPage>({ title: '', lastupdated: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Locale loading is now handled by context/useLocaleSection
      if (!mounted) return;

      const title = ns?.title || '';
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
      keys.forEach((k) => {
        data[k] = parseMaybeObject(ns ? ns[k] : '');
      });

      // ensure known list fields become arrays when strings
      ['userconductlist', 'disclaimerlist', 'uselicenselist'].forEach((lk) => {
        const val = data[lk];
        if (typeof val === 'string') {
          data[lk] = parseSections(val);
        } else if (Array.isArray(val)) {
          data[lk] = val;
        } else if (val && typeof val === 'object') {
          // Convert object to array of values
          data[lk] = Object.values(val);
        } else {
          data[lk] = [];
        }
      });

      setPage({ title, lastupdated, ...data });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !page.title) {
    return (
      <PageLayout metaKey="terms_of_service.meta" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Terms' }]} className="layout-md">
        <div className="flex items-center justify-center py-4">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  const renderListItem = (arr: any, idx: number) => {
    if (!arr || !Array.isArray(arr) || idx >= arr.length) return '';
    const item = arr[idx];
    return typeof item === 'string' ? item : (item ? String(item) : '');
  };

  return (
    <PageLayout
      metaKey="terms_of_service.meta"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
      className="layout-md"
    >
      <div className="space-y-8" id="terms-of-service-content">
        {/* Header with last updated */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b-2 border-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <strong className="text-xl md:text-lg ">{page.lastupdated}</strong>
          </div>
          <TextToSpeech sectionId="terms-of-service-content" />
        </div>

        {/* Acceptance section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 md:p-8">
          <h2 className="text-xl sm:text-lg text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            {page.acceptancetitle}
          </h2>
          <p className="leading-relaxed">{page.intro}</p>
        </section>

        {/* Use License */}
        <section className="bg-white border-2 border-amber-100 rounded-2xl p-4 md:p-8 shadow-lg">
          <h3 className="text-xl sm:text-lg text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">📜</span>
            {page.uselicensetitle}
          </h3>
          <p className="leading-relaxed mb-4">{page.uselicensetext}</p>
          <ul role="list" className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => {
              const item = renderListItem(page.uselicenselist, i);
              return item ? (
                <li key={i} className="flex items-start gap-3 ">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full" />
                  <span className="flex-1">{item}</span>
                </li>
              ) : null;
            })}
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="bg-white border-2 border-amber-100 rounded-2xl p-4 md:p-8 shadow-lg">
          <h4 className="text-xl sm:text-lg text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">©️</span>
            {page.intellectualtitle}
          </h4>
          <p className="leading-relaxed">{page.intellectualtext}</p>
        </section>

        {/* User Conduct */}
        <section className="bg-white border-2 border-amber-100 rounded-2xl p-4 md:p-8 shadow-lg">
          <h5 className="text-xl sm:text-lg text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">👤</span>
            {page.userconducttitle}
          </h5>
          <p className="leading-relaxed mb-4">{page.userconductintro}</p>
          <ul role="list" className="space-y-3">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const item = renderListItem(page.userconductlist, i);
              return item ? (
                <li key={i} className="flex items-start gap-3 ">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full" />
                  <span className="flex-1">{item}</span>
                </li>
              ) : null;
            })}
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-4 md:p-8 shadow-lg">
          <h6 className="text-xl sm:text-lg text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            {page.disclaimertitle}
          </h6>
          <p className="leading-relaxed mb-4">{page.disclaimertext}</p>
          <ul role="list" className="space-y-3 mb-4">
            {[0, 1, 2, 3].map((i) => {
              const item = renderListItem(page.disclaimerlist, i);
              return item ? (
                <li key={i} className="flex items-start gap-3 ">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full" />
                  <span className="flex-1">{item}</span>
                </li>
              ) : null;
            })}
          </ul>
          <p className="leading-relaxed">{page.disclaimerclosing}</p>
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
          <section key={idx} className="bg-white border-2 border-amber-100 rounded-2xl p-4 md:p-8 shadow-lg">
            <p className="text-xl sm:text-lg text-gray-900 mb-4 flex items-center gap-3">
              <span className="text-2xl">{section.icon}</span>
              {section.title}
            </p>
            <p className="leading-relaxed">{section.text}</p>
          </section>
        ))}

        {/* Contact section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 md:p-8">
          <p className="text-xl sm:text-lg text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">📞</span>
            {page.contacttitle}
          </p>
          <p className="leading-relaxed mb-4">{page.contacttext}</p>
          <div className="space-y-2 ">
            <p><strong className="text-amber-800">{page.contactphonelabel}</strong> {page.contactphone}</p>
            <p><strong className="text-amber-800">{page.contactemaillabel}</strong> {page.contactemail}</p>
            <p><strong className="text-amber-800">{page.contactwebsitelabel}</strong> <a href="https://sanatanadharmam.in" className="text-amber-800 hover:text-orange-700 underline transition-colors">{page.contactwebsite}</a></p>
          </div>
          <p className="leading-relaxed mt-6 pt-4 border-t border-amber-300">{page.closing}</p>
        </section>
      </div>
    </PageLayout>
  );
}
