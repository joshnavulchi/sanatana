/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, DEFAULT_LOCALE } from '@lib/i18n';
import PageLayout from '@components/common/PageLayout';

export default function PrivacyPolicyPage({ searchParams }: any) {
  const locale = DEFAULT_LOCALE;
  const S = (k: string) => String(t(k, locale));

  const page = {
    title: S('policies.privacypolicy.title'),
    intro: S('policies.privacypolicy.intro'),
    informationHeading: S('policies.privacypolicy.informationheading'),
    informationDesc: S('policies.privacypolicy.informationdesc'),
    howWeUse: S('policies.privacypolicy.howweuse'),
    howWeUseDesc: S('policies.privacypolicy.howweusedesc'),
    yourRights: S('policies.privacypolicy.yourrights'),
    yourRightsDesc: S('policies.privacypolicy.yourrightsdesc'),
    lastUpdated: S('policies.privacypolicy.lastupdated').replace('{date}', new Date().toLocaleDateString()),
  };

  return (
    <PageLayout
      metaKey="policies"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
      className="layout-md"
    >
      <div className="space-y-6 md:space-y-8 text-base leading-relaxed font-normal">
        <h2 className="page-title text-2xl font-semibold leading-snug mb-3">{page.title}</h2>
        <p className="body-text text-base leading-relaxed mb-4 font-normal">{page.intro}</p>

        <h3 className="section-title text-xl font-semibold leading-snug mb-2">{page.informationHeading}</h3>
        <p className="body-text text-base leading-relaxed mb-4 font-normal">{page.informationDesc}</p>

        <h3 className="section-title text-xl font-semibold leading-snug mb-2">{page.howWeUse}</h3>
        <p className="body-text text-base leading-relaxed mb-4 font-normal">{page.howWeUseDesc}</p>

        <h3 className="section-title text-xl font-semibold leading-snug mb-2">{page.yourRights}</h3>
        <p className="body-text text-base leading-relaxed mb-4 font-normal">{page.yourRightsDesc}</p>

        <p className="text-base leading-relaxed mb-4 font-normal"><strong>{page.lastUpdated}</strong></p>
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */