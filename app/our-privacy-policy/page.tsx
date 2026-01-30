/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';
import { createGenerateMetadata, resolveLocaleFromHeaders } from 'lib/pageUtils';
import PageLayout from '@/app/components/common/PageLayout';

export const generateMetadata = createGenerateMetadata('policies', 'policies.privacypolicy.title', 'policies.privacypolicy.intro');

export default function PrivacyPolicyPage({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
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
      className="layout-sm"
    >
      <div>
        <h2 className="h4">{page.title}</h2>
        <p>{page.intro}</p>
        <h3 className="h4">{page.informationHeading}</h3>
        <p>{page.informationDesc}</p>
        <h3 className="h4">{page.howWeUse}</h3>
        <p>{page.howWeUseDesc}</p>
        <h3 className="h4">{page.yourRights}</h3>
        <p>{page.yourRightsDesc}</p>
        <p className="mt-6"><strong>{page.lastUpdated}</strong></p>
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */