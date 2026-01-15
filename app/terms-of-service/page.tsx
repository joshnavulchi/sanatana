/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('terms');

export default async function TermsOfService({ searchParams }: any) {
  const locale = await detectLocale(searchParams);
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('terms', {}, locale) || {};
    const get = (p: string) => (typeof k[p] === 'string' ? k[p] : String(t(p, locale)));
    return {
      meta: k.meta || {},
      title: String(t('terms.title', locale) || ''),
      lastupdated: get('terms.lastupdated'),
      intro: get('terms.intro'),
      acceptancetitle: get('terms.acceptancetitle'),
      uselicensetitle: get('terms.uselicensetitle'),
      uselicensetext: get('terms.uselicensetext'),
      uselicenselist: k.uselicenselist ?? {},
      intellectualtitle: get('terms.intellectualtitle'),
      intellectualtext: get('terms.intellectualtext'),
      userconducttitle: get('terms.userconducttitle'),
      userconductintro: get('terms.userconductintro'),
      userconductlist: k.userconductlist ?? {},
      disclaimertitle: get('terms.disclaimertitle'),
      disclaimertext: get('terms.disclaimertext'),
      disclaimerlist: k.disclaimerlist ?? {},
      disclaimerclosing: get('terms.disclaimerclosing'),
      liabilitytitle: get('terms.liabilitytitle'),
      liabilitytext: get('terms.liabilitytext'),
      externallinkstitle: get('terms.externallinkstitle'),
      externallinkstext: get('terms.externallinkstext'),
      modificationstitle: get('terms.modificationstitle'),
      modificationstext: get('terms.modificationstext'),
      terminationtitle: get('terms.terminationtitle'),
      terminationtext: get('terms.terminationtext'),
      indemnificationtitle: get('terms.indemnificationtitle'),
      indemnificationtext: get('terms.indemnificationtext'),
      governingtitle: get('terms.governingtitle'),
      governingtext: get('terms.governingtext'),
      severabilitytitle: get('terms.severabilitytitle'),
      severabilitytext: get('terms.severabilitytext'),
      contacttitle: get('terms.contacttitle'),
      contacttext: get('terms.contacttext'),
      contactphonelabel: get('terms.contactphonelabel'),
      contactphone: get('terms.contactphone'),
      contactemaillabel: get('terms.contactemaillabel'),
      contactemail: get('terms.contactemail'),
      contactwebsitelabel: get('terms.contactwebsitelabel'),
      contactwebsite: get('terms.contactwebsite'),
      closing: get('terms.closing')
    };
  })();

  return (
    <PageLayout
      metaKey="terms.meta"
      title={page.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]}
      className="layout-sm"
    >
      <div>
        <p><strong>{page.lastupdated}</strong></p>
        <h2>{page.acceptancetitle}</h2>
        <p>{page.intro}</p>
        <h3>{page.uselicensetitle}</h3>
        <p>{page.uselicensetext}</p>
        <ul role="list" className="list-disc">
          <li>{(page.uselicenselist && page.uselicenselist.modification) || S('terms.uselicenselist.modification')}</li>
          <li>{(page.uselicenselist && page.uselicenselist.copying) || S('terms.uselicenselist.copying')}</li>
          <li>{(page.uselicenselist && page.uselicenselist.unauthorizedAccess) || S('terms.uselicenselist.unauthorizedAccess')}</li>
          <li>{(page.uselicenselist && page.uselicenselist.reverseEngineering) || S('terms.uselicenselist.reverseEngineering')}</li>
          <li>{(page.uselicenselist && page.uselicenselist.interfering) || S('terms.uselicenselist.interfering')}</li>
        </ul>
        <h4>{page.intellectualtitle}</h4>
        <p>{page.intellectualtext}</p>
        <h5>{page.userconducttitle}</h5>
        <p>{page.userconductintro}</p>
        <ul role="list" className="list-disc">
          <li>{(page.userconductlist && page.userconductlist.unlawful) || S('terms.userconductlist.unlawful')}</li>
          <li>{(page.userconductlist && page.userconductlist.harassment) || S('terms.userconductlist.harassment')}</li>
          <li>{(page.userconductlist && page.userconductlist.malware) || S('terms.userconductlist.malware')}</li>
          <li>{(page.userconductlist && page.userconductlist.violateLaw) || S('terms.userconductlist.violateLaw')}</li>
          <li>{(page.userconductlist && page.userconductlist.spam) || S('terms.userconductlist.spam')}</li>
          <li>{(page.userconductlist && page.userconductlist.bypass) || S('terms.userconductlist.bypass')}</li>
        </ul>
        <h6>{page.disclaimertitle}</h6>
        <p>{page.disclaimertext}</p>
        <ul role="list" className="list-disc">
          <li>{(page.disclaimerlist && page.disclaimerlist.accuracy) || S('terms.disclaimerlist.accuracy')}</li>
          <li>{(page.disclaimerlist && page.disclaimerlist.functionality) || S('terms.disclaimerlist.functionality')}</li>
          <li>{(page.disclaimerlist && page.disclaimerlist.errors) || S('terms.disclaimerlist.errors')}</li>
          <li>{(page.disclaimerlist && page.disclaimerlist.quality) || S('terms.disclaimerlist.quality')}</li>
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
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */