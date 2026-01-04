/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import { parseList } from 'lib/parseList';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('privacy_policy');

export default async function PrivacyPolicy() {
  const locale = await detectLocale();
  const S = (k: string) => String(t(k, locale));
  return (
    <>
      <PageLayout
        metaKey="privacy_policy"
        title={S('privacy_policy.title')}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Privacy & Policy' }]}
        className="layout-sm"
      >
        <div>
          <p>
            <strong>{S('privacy_policy.lastupdated')}</strong> {S('privacy_policy.lastupdated')}
          </p>
          <h3 className="text-small">{S('privacy_policy.intro.title')}</h3>
          <p>{S('privacy_policy.intro.text')}</p>
          <h4 className="text-small">{S('privacy_policy.informationwecollect.title')}</h4>
          <p>{S('privacy_policy.informationwecollect.lead')}</p>
          <ul role="list" className="list-disc">
            <li><strong>{S('privacy_policy.informationwecollect.usagelabel')}</strong> {S('privacy_policy.informationwecollect.usage')}</li>
            <li><strong>{S('privacy_policy.informationwecollect.devicelabel')}</strong> {S('privacy_policy.informationwecollect.device')}</li>
            <li><strong>{S('privacy_policy.informationwecollect.cookieslabel')}</strong> {S('privacy_policy.informationwecollect.cookies')}</li>
            <li><strong>{S('privacy_policy.informationwecollect.contactlabel')}</strong> {S('privacy_policy.informationwecollect.contact')}</li>
          </ul>
          <h5 className="text-small">{S('privacy_policy.howweuse.title')}</h5>
          <p>{S('privacy_policy.howweuse.lead')}</p>
          <ul role="list" className="list-disc">
            {parseList(t('privacy_policy.howWeUse.items', locale)).map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <h6 className="text-small">{S('privacy_policy.cookiesLocalstorage.title')}</h6>
          <p>{S('privacy_policy.cookiesLocalStorage.text')}</p>
          <p className="text-small font-bold">{S('privacy_policy.thirdparty.title')}</p>
          <p>{S('privacy_policy.thirdParty.text')}</p>
          <p className="text-small font-bold">{S('privacy_policy.security.title')}</p>
          <p>{S('privacy_policy.security.text')}</p>
          <p className="text-small font-bold">{S('privacy_policy.rights.title')}</p>
          <p>{S('privacy_policy.rights.lead')}</p>
          <ul role="list" className="list-disc">
            {parseList(t('privacy_policy.rights.items', locale)).map((it: string, idx: number) => (
              <li key={idx}>{it}</li>
            ))}
          </ul>
          <p>{S('privacy_policy.rights.contacttext')}</p>
          <p className="text-small font-bold">{S('privacy_policy.children.title')}</p>
          <p>{S('privacy_policy.children.text')}</p>
          <p className="text-small font-bold">{S('privacy_policy.changes.title')}</p>
          <p>{S('privacy_policy.changes.text')}</p>
          <p className="text-small font-bold">{S('privacy_policy.contact.title')}</p>
          <p>{S('privacy_policy.contact.lead')}</p>
          <p>
            <strong>{S('privacy_policy.contact.emaillabel')}</strong> {S('privacy_policy.contact.email')}
          </p>
          <p>
            <strong>{S('privacy_policy.contact.websitelabel')}</strong> <a href="https://sanatanadharmam.in">{S('privacy_policy.contact.website')}</a>
          </p>
          <p>{S('privacy_policy.contact.closing')}</p>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */