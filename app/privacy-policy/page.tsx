/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';
import { parseList } from 'lib/parseList';
import PageLayout from '@components/common/PageLayout';
import { createGenerateMetadata } from 'lib/pageUtils';
export const generateMetadata = createGenerateMetadata('privacy_policy');
export default async function PrivacyPolicy() {
  const locale = await detectLocale();
  const S = (k: string) => String(t(k, locale));
  return (
    <>
      <PageLayout title={S('privacy.title')} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: String(t('privacy.title')) }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        <div>
          <p>
            <strong>{S('privacy.lastUpdated')}</strong> {S('privacy.lastUpdated')}
          </p>
          <h3 className="text-small">{S('privacy.intro.title')}</h3>
          <p>{S('privacy.intro.text')}</p>
          <h4 className="text-small">{S('privacy.informationWeCollect.title')}</h4>
          <p>{S('privacy.informationWeCollect.lead')}</p>
          <ul role="list" className="list-disc">
            <li><strong>{S('privacy.informationWeCollect.usageLabel')}</strong> {S('privacy.informationWeCollect.usage')}</li>
            <li><strong>{S('privacy.informationWeCollect.deviceLabel')}</strong> {S('privacy.informationWeCollect.device')}</li>
            <li><strong>{S('privacy.informationWeCollect.cookiesLabel')}</strong> {S('privacy.informationWeCollect.cookies')}</li>
            <li><strong>{S('privacy.informationWeCollect.contactLabel')}</strong> {S('privacy.informationWeCollect.contact')}</li>
          </ul>
          <h5 className="text-small">{S('privacy.howWeUse.title')}</h5>
          <p>{S('privacy.howWeUse.lead')}</p>
          <ul role="list" className="list-disc">
            {parseList(t('privacy.howWeUse.items', locale)).map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <h6 className="text-small">{S('privacy.cookiesLocalStorage.title')}</h6>
          <p>{S('privacy.cookiesLocalStorage.text')}</p>
          <p className="text-small font-bold">{S('privacy.thirdParty.title')}</p>
          <p>{S('privacy.thirdParty.text')}</p>
          <p className="text-small font-bold">{S('privacy.security.title')}</p>
          <p>{S('privacy.security.text')}</p>
          <p className="text-small font-bold">{S('privacy.rights.title')}</p>
          <p>{S('privacy.rights.lead')}</p>
          <ul role="list" className="list-disc">
            {parseList(t('privacy.rights.items', locale)).map((it: string, idx: number) => (
              <li key={idx}>{it}</li>
            ))}
          </ul>
          <p>{S('privacy.rights.contactText')}</p>
          <p className="text-small font-bold">{S('privacy.children.title')}</p>
          <p>{S('privacy.children.text')}</p>
          <p className="text-small font-bold">{S('privacy.changes.title')}</p>
          <p>{S('privacy.changes.text')}</p>
          <p className="text-small font-bold">{S('privacy.contact.title')}</p>
          <p>{S('privacy.contact.lead')}</p>
          <p>
            <strong>{S('privacy.contact.emailLabel')}</strong> {S('privacy.contact.email')}
          </p>
          <p>
            <strong>{S('privacy.contact.websiteLabel')}</strong> <a href="https://sanatanadharmam.in">{S('privacy.contact.website')}</a>
          </p>
          <p>{S('privacy.contact.closing')}</p>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */