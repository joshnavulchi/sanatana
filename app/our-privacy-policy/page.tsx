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
      <div className="space-y-8 md:space-y-12 text-base leading-relaxed font-normal bg-gradient-to-br from-emerald-50 via-teal-100 to-emerald-100/80 rounded-3xl border border-emerald-200/30 shadow-xl p-8 md:p-12 animate-fadeIn">
        <h3 className="page-title text-3xl font-bold leading-snug mb-4 text-emerald-900 drop-shadow">{page.title}</h3>
        <p className="body-text text-base leading-relaxed mb-6 font-normal text-emerald-800/90 bg-gradient-to-r from-emerald-100/60 to-teal-50/40 rounded-xl px-4 py-2 shadow-sm">{page.intro}</p>

        <h3 className="section-title text-xl font-semibold leading-snug mb-2 text-emerald-800">{page.informationHeading}</h3>
        <p className="body-text text-base leading-relaxed mb-4 font-normal text-emerald-900/90 bg-gradient-to-r from-emerald-50/80 to-teal-100/60 rounded-lg px-3 py-2 shadow-sm">{page.informationDesc}</p>

        <h3 className="section-title text-xl font-semibold leading-snug mb-2 text-emerald-800">{page.howWeUse}</h3>
        <p className="body-text text-base leading-relaxed mb-4 font-normal text-emerald-900/90 bg-gradient-to-r from-teal-50/80 to-emerald-100/60 rounded-lg px-3 py-2 shadow-sm">{page.howWeUseDesc}</p>

        <h3 className="section-title text-xl font-semibold leading-snug mb-2 text-emerald-800">{page.yourRights}</h3>
        <p className="body-text text-base leading-relaxed mb-4 font-normal text-emerald-900/90 bg-gradient-to-r from-emerald-50/80 to-teal-100/60 rounded-lg px-3 py-2 shadow-sm">{page.yourRightsDesc}</p>

        <p className="text-base leading-relaxed mb-4 font-normal text-emerald-700"><strong>{page.lastUpdated}</strong></p>
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */