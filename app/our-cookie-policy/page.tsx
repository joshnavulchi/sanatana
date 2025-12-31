/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { detectLocale, t } from '../../lib/i18n';
import { resolveLocaleFromHeaders } from 'lib/pageUtils';

export default function CookiePolicyPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));
  return (
    <>
      <div className="content-wrapper md page-space-xl">
        <p>{S('policies.cookiePolicy.title')}</p>
        <p>{S('policies.cookiePolicy.intro')}</p>
        <p>{S('policies.cookiePolicy.whatAreCookies')}</p>
        <p>{S('policies.cookiePolicy.whatAreCookiesDesc') || 'Cookies are small text files stored on your device when you visit websites. They help websites remember preferences and improve your experience.'}</p>
        <p>{S('policies.cookiePolicy.typesHeading')}</p>
        <ul role="list" className="list-disc">
          <li><strong>{S('policies.cookiePolicy.types.strictlyNecessary')}</strong></li>
          <li><strong>{S('policies.cookiePolicy.types.functionality')}</strong></li>
          <li><strong>{S('policies.cookiePolicy.types.performance')}</strong></li>
          <li><strong>{S('policies.cookiePolicy.types.targeting')}</strong></li>
        </ul>
        <p>{S('policies.cookiePolicy.managing')}</p>
        <p>{S('policies.cookiePolicy.managingDesc')}</p>
        <p>{S('policies.cookiePolicy.dataSharing')}</p>
        <p>{S('policies.cookiePolicy.dataSharingDesc')}</p>
        <p>{S('policies.cookiePolicy.lastUpdated').replace('{date}', new Date().toLocaleDateString())}</p>
      </div>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */