"use client";
import React, { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale } from 'lib/i18n';
import { useT } from '../hooks/useT';

import { parseSections, parseMaybeObject } from 'lib/parseContent';
import styles from '../privacy-policy/page.module.scss';

type PartialPage = Record<string, any>;

export default function TermsOfService() {
  const { locale } = useLocale();
  const t = useT();
  const [page, setPage] = useState<PartialPage>({ title: '', lastupdated: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => {});
      } catch (e) {}
      if (!mounted) return;

      const title = t('terms.title') || '';
      const lastupdated = t('terms.lastupdated') || '';

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
        data[k] = parseMaybeObject(t(`terms.${k}`));
      });

      // ensure known list fields become arrays when strings
      ['userconductlist', 'disclaimerlist', 'uselicenselist'].forEach((lk) => {
        if (typeof data[lk] === 'string') data[lk] = parseSections(data[lk]);
      });

      setPage({ title, lastupdated, ...data });
    })();
    return () => { mounted = false; };
  }, [locale]);

  const S = (k: string) => String(t(k));

  const renderListItem = (arr: any, idx: number, fallbackKey: string) => (
    (arr && arr[idx]) || S(fallbackKey)
  );

  return (
    <PageLayout
      metaKey="terms.meta"
      title={page.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]}
      className="layout-sm"
    >
      <div>
        <p><strong>{page.lastupdated}</strong></p>
        <h2 className="h4">{page.acceptancetitle}</h2>
        <p>{page.intro}</p>
        <h3 className="h4">{page.uselicensetitle}</h3>
        <p>{page.uselicensetext}</p>
        <ul role="list" className="list-disc">
          <li>{renderListItem(page.uselicenselist, 0, 'terms.uselicenselist.modification')}</li>
          <li>{renderListItem(page.uselicenselist, 1, 'terms.uselicenselist.copying')}</li>
          <li>{renderListItem(page.uselicenselist, 2, 'terms.uselicenselist.unauthorizedAccess')}</li>
          <li>{renderListItem(page.uselicenselist, 3, 'terms.uselicenselist.reverseEngineering')}</li>
          <li>{renderListItem(page.uselicenselist, 4, 'terms.uselicenselist.interfering')}</li>
        </ul>
        <h4>{page.intellectualtitle}</h4>
        <p>{page.intellectualtext}</p>
        <h5 className="h4">{page.userconducttitle}</h5>
        <p>{page.userconductintro}</p>
        <ul role="list" className="list-disc">
          <li>{renderListItem(page.userconductlist, 0, 'terms.userconductlist.unlawful')}</li>
          <li>{renderListItem(page.userconductlist, 1, 'terms.userconductlist.harassment')}</li>
          <li>{renderListItem(page.userconductlist, 2, 'terms.userconductlist.malware')}</li>
          <li>{renderListItem(page.userconductlist, 3, 'terms.userconductlist.violateLaw')}</li>
          <li>{renderListItem(page.userconductlist, 4, 'terms.userconductlist.spam')}</li>
          <li>{renderListItem(page.userconductlist, 5, 'terms.userconductlist.bypass')}</li>
        </ul>
        <h6 className="h4">{page.disclaimertitle}</h6>
        <p>{page.disclaimertext}</p>
        <ul role="list" className="list-disc">
          <li>{renderListItem(page.disclaimerlist, 0, 'terms.disclaimerlist.accuracy')}</li>
          <li>{renderListItem(page.disclaimerlist, 1, 'terms.disclaimerlist.functionality')}</li>
          <li>{renderListItem(page.disclaimerlist, 2, 'terms.disclaimerlist.errors')}</li>
          <li>{renderListItem(page.disclaimerlist, 3, 'terms.disclaimerlist.quality')}</li>
        </ul>
        <p>{page.disclaimerclosing}</p>
        <p className="font-semibold">{page.liabilitytitle}</p>
        <p>{page.liabilitytext}</p>
        <p className="font-semibold">{page.externallinkstitle}</p>
        <p>{page.externallinkstext}</p>
        <p className="font-semibold">{page.modificationstitle}</p>
        <p>{page.modificationstext}</p>
        <p className="font-semibold">{page.terminationtitle}</p>
        <p>{page.terminationtext}</p>
        <p className="font-semibold">{page.indemnificationtitle}</p>
        <p>{page.indemnificationtext}</p>
        <p className="font-semibold">{page.governingtitle}</p>
        <p>{page.governingtext}</p>
        <p className="font-semibold">{page.severabilitytitle}</p>
        <p>{page.severabilitytext}</p>
        <p className="font-semibold">{page.contacttitle}</p>
        <p>{page.contacttext}</p>
        <p><strong>{page.contactphonelabel}</strong> {page.contactphone}</p>
        <p><strong>{page.contactemaillabel}</strong> {page.contactemail}</p>
        <p><strong>{page.contactwebsitelabel}</strong> <a href="https://sanatanadharmam.in">{page.contactwebsite}</a></p>
        <p>{page.closing}</p>
      </div>
    </PageLayout>
  );
}
