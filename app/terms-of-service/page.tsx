/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('terms_of_service');
export default async function TermsOfService({ searchParams }: any) {
  const locale = await detectLocale(searchParams);
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('terms', {}, locale) || {};
    const get = (p: string) => (typeof k[p] === 'string' ? k[p] : String(t(p, locale)));
    return {
      title: typeof k.title === 'string' ? k.title : String(t('terms.title', locale) || ''),
      lastUpdated: get('terms.lastUpdated'),
      intro: get('terms.intro'),
      acceptanceTitle: get('terms.acceptanceTitle'),
      useLicenseTitle: get('terms.useLicenseTitle'),
      useLicenseText: get('terms.useLicenseText'),
      useLicenseList: k.useLicenseList ?? {},
      intellectualTitle: get('terms.intellectualTitle'),
      intellectualText: get('terms.intellectualText'),
      userConductTitle: get('terms.userConductTitle'),
      userConductIntro: get('terms.userConductIntro'),
      userConductList: k.userConductList ?? {},
      disclaimerTitle: get('terms.disclaimerTitle'),
      disclaimerText: get('terms.disclaimerText'),
      disclaimerList: k.disclaimerList ?? {},
      disclaimerClosing: get('terms.disclaimerClosing'),
      liabilityTitle: get('terms.liabilityTitle'),
      liabilityText: get('terms.liabilityText'),
      externalLinksTitle: get('terms.externalLinksTitle'),
      externalLinksText: get('terms.externalLinksText'),
      modificationsTitle: get('terms.modificationsTitle'),
      modificationsText: get('terms.modificationsText'),
      terminationTitle: get('terms.terminationTitle'),
      terminationText: get('terms.terminationText'),
      indemnificationTitle: get('terms.indemnificationTitle'),
      indemnificationText: get('terms.indemnificationText'),
      governingTitle: get('terms.governingTitle'),
      severabilityTitle: get('terms.severabilityTitle'),
      contactTitle: get('terms.contactTitle'),
      contactEmailLabel: get('terms.contactEmailLabel'),
      contactEmail: get('terms.contactEmail'),
      contactWebsiteLabel: get('terms.contactWebsiteLabel'),
      contactWebsite: get('terms.contactWebsite'),
      closing: get('terms.closing')
    };
  })();

  return (
    <PageLayout metaKey="terms_of_service" title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: page.title }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
      <div>
        <p>
          <strong>{page.lastUpdated}</strong> {page.lastUpdated}
        </p>
        <h3>{page.acceptanceTitle}</h3>
        <p>{page.intro}</p>
        <h4>{page.useLicenseTitle}</h4>
        <p>{page.useLicenseText}</p>
        <ul role="list" className="list-disc">
          <li>{(page.useLicenseList && page.useLicenseList.modification) || S('terms.useLicenseList.modification')}</li>
          <li>{(page.useLicenseList && page.useLicenseList.copying) || S('terms.useLicenseList.copying')}</li>
          <li>{(page.useLicenseList && page.useLicenseList.unauthorizedAccess) || S('terms.useLicenseList.unauthorizedAccess')}</li>
          <li>{(page.useLicenseList && page.useLicenseList.reverseEngineering) || S('terms.useLicenseList.reverseEngineering')}</li>
          <li>{(page.useLicenseList && page.useLicenseList.interfering) || S('terms.useLicenseList.interfering')}</li>
        </ul>
        <h5>{page.intellectualTitle}</h5>
        <p>{page.intellectualText}</p>
        <h6>{page.userConductTitle}</h6>
        <p>{page.userConductIntro}</p>
        <ul role="list" className="list-disc">
          <li>{(page.userConductList && page.userConductList.unlawful) || S('terms.userConductList.unlawful')}</li>
          <li>{(page.userConductList && page.userConductList.harassment) || S('terms.userConductList.harassment')}</li>
          <li>{(page.userConductList && page.userConductList.malware) || S('terms.userConductList.malware')}</li>
          <li>{(page.userConductList && page.userConductList.violateLaw) || S('terms.userConductList.violateLaw')}</li>
          <li>{(page.userConductList && page.userConductList.spam) || S('terms.userConductList.spam')}</li>
          <li>{(page.userConductList && page.userConductList.bypass) || S('terms.userConductList.bypass')}</li>
        </ul>
        <p>{page.disclaimerTitle}</p>
        <p>{page.disclaimerText}</p>
        <ul role="list" className="list-disc">
          <li>{(page.disclaimerList && page.disclaimerList.accuracy) || S('terms.disclaimerList.accuracy')}</li>
          <li>{(page.disclaimerList && page.disclaimerList.functionality) || S('terms.disclaimerList.functionality')}</li>
          <li>{(page.disclaimerList && page.disclaimerList.errors) || S('terms.disclaimerList.errors')}</li>
          <li>{(page.disclaimerList && page.disclaimerList.quality) || S('terms.disclaimerList.quality')}</li>
        </ul>
        <p>{page.disclaimerClosing}</p>
        <p>{page.liabilityTitle}</p>
        <p>{page.liabilityText}</p>
        <p>{page.externalLinksTitle}</p>
        <p>{page.externalLinksText}</p>
        <p>{page.modificationsTitle}</p>
        <p>{page.modificationsText}</p>
        <p>{page.terminationTitle}</p>
        <p>{page.terminationText}</p>
        <p>{page.indemnificationTitle}</p>
        <p>{page.indemnificationText}</p>
        <p>{page.governingTitle}</p>
        <p>{page.governingTitle}</p>
        <p>{page.severabilityTitle}</p>
        <p>{page.severabilityTitle}</p>
        <p>{page.contactTitle}</p>
        <p>{page.contactTitle}</p>
        <p><strong>{page.contactEmailLabel}</strong> {page.contactEmail}</p>
        <p><strong>{page.contactWebsiteLabel}</strong> <a href="https://sanatanadharmam.in">{page.contactWebsite}</a></p>
        <p>{page.closing}</p>
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */