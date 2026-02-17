/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@components/common/PageLayout';
import { createGenerateMetadata } from '@lib/pageUtils';
import { t, detectLocale, DEFAULT_LOCALE } from '@lib/i18n';

export const generateMetadata = createGenerateMetadata('policies', 'policies.privacypolicy.title', 'policies.privacypolicy.intro');

export default function PrivacyPolicyPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || DEFAULT_LOCALE;
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
      <div>
        <h2 className="text-2xl md:text-3xl text-gray-900">{page.title}</h2>
        <p className="">{page.intro}</p>
        <h3 className="text-2xl md:text-3xl text-gray-900">{page.informationHeading}</h3>
        <p className="">{page.informationDesc}</p>
        <h3 className="text-2xl md:text-3xl text-gray-900">{page.howWeUse}</h3>
        <p className="">{page.howWeUseDesc}</p>
        <h3 className="text-2xl md:text-3xl text-gray-900">{page.yourRights}</h3>
        <p className="">{page.yourRightsDesc}</p>
        <p className="mt-6 "><strong>{page.lastUpdated}</strong></p>
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */