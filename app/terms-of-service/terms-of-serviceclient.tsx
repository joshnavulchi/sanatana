"use client";
import React, { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale, getLocaleObject } from 'lib/i18n';
import useLocaleSection from '../hooks/useLocaleSection';
import Loader from '@/app/components/loader/loader';

import { parseSections, parseMaybeObject } from 'lib/parseContent';
import TextToSpeech from '../components/text-to-speech/TextToSpeech';

type PartialPage = Record<string, any>;

export default function TermsOfService() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('terms_of_service');

  // Initialize with current data to prevent empty renders on refresh
  const getInitialPage = (): PartialPage => {
    try {
      const localeObj = getLocaleObject(locale) as any;
      if (!localeObj || Object.keys(localeObj).length === 0) {
        return { title: '', lastupdated: '' };
      }
      const terms = localeObj?.terms_of_service || {};
      const title = terms.title || '';
      const lastupdated = terms.lastupdated || '';
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
        data[k] = parseMaybeObject(terms[k] || '');
      });
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
      return { title, lastupdated, ...data };
    } catch (e) {
      console.error('Error in getInitialPage:', e);
      return { title: '', lastupdated: '' };
    }
  };

  const [page, setPage] = useState<PartialPage>(getInitialPage);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => { });
      } catch (e) { }
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
      <PageLayout metaKey="terms_of_service.meta" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Terms' }]} className="layout-sm">
        <div className="flex items-center justify-center py-12">
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
      className="layout-sm"
    >
      <div id="terms-of-service-content">
        <p className="flex items-center justify-between">
          <strong>{page.lastupdated}</strong>
          {/* Text-to-Speech Player */}
          <TextToSpeech sectionId="terms-of-service-content" />
        </p>
        <h2 className="h4">{page.acceptancetitle}</h2>
        <p>{page.intro}</p>
        <h3 className="h4">{page.uselicensetitle}</h3>
        <p>{page.uselicensetext}</p>
        <ul role="list" className="list-disc">
          <li>{renderListItem(page.uselicenselist, 0)}</li>
          <li>{renderListItem(page.uselicenselist, 1)}</li>
          <li>{renderListItem(page.uselicenselist, 2)}</li>
          <li>{renderListItem(page.uselicenselist, 3)}</li>
          <li>{renderListItem(page.uselicenselist, 4)}</li>
        </ul>
        <h4>{page.intellectualtitle}</h4>
        <p>{page.intellectualtext}</p>
        <h5 className="h4">{page.userconducttitle}</h5>
        <p>{page.userconductintro}</p>
        <ul role="list" className="list-disc">
          <li>{renderListItem(page.userconductlist, 0)}</li>
          <li>{renderListItem(page.userconductlist, 1)}</li>
          <li>{renderListItem(page.userconductlist, 2)}</li>
          <li>{renderListItem(page.userconductlist, 3)}</li>
          <li>{renderListItem(page.userconductlist, 4)}</li>
          <li>{renderListItem(page.userconductlist, 5)}</li>
        </ul>
        <h6 className="h4">{page.disclaimertitle}</h6>
        <p>{page.disclaimertext}</p>
        <ul role="list" className="list-disc">
          <li>{renderListItem(page.disclaimerlist, 0)}</li>
          <li>{renderListItem(page.disclaimerlist, 1)}</li>
          <li>{renderListItem(page.disclaimerlist, 2)}</li>
          <li>{renderListItem(page.disclaimerlist, 3)}</li>
        </ul>
        <p>{page.disclaimerclosing}</p>
        <p className="h4">{page.liabilitytitle}</p>
        <p>{page.liabilitytext}</p>
        <p className="h4">{page.externallinkstitle}</p>
        <p>{page.externallinkstext}</p>
        <p className="h4">{page.modificationstitle}</p>
        <p>{page.modificationstext}</p>
        <p className="h4">{page.terminationtitle}</p>
        <p>{page.terminationtext}</p>
        <p className="h4">{page.indemnificationtitle}</p>
        <p>{page.indemnificationtext}</p>
        <p className="h4">{page.governingtitle}</p>
        <p>{page.governingtext}</p>
        <p className="h4">{page.severabilitytitle}</p>
        <p>{page.severabilitytext}</p>
        <p className="h4">{page.contacttitle}</p>
        <p>{page.contacttext}</p>
        <p><strong>{page.contactphonelabel}</strong> {page.contactphone}</p>
        <p><strong>{page.contactemaillabel}</strong> {page.contactemail}</p>
        <p><strong>{page.contactwebsitelabel}</strong> <a href="https://sanatanadharmam.in">{page.contactwebsite}</a></p>
        <p>{page.closing}</p>
      </div>
    </PageLayout>
  );
}
