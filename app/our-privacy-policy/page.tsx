/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import PageLayout from '@components/common/PageLayout';
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import { t, DEFAULT_LOCALE } from '@lib/i18n';

export const generateMetadata = createGenerateMetadata('policies', 'policies.privacypolicy.title', 'policies.privacypolicy.intro');

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
    <>
      <StructuredData metaKey="policies" />
      <PageLayout
        metaKey="policies"
        title={page.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
        className="layout-md"
      >
        <div className="space-y-6 md:space-y-8">
          <h2 className="page-title">{page.title}</h2>
          <p className="body-text">{page.intro}</p>

          <h3 className="section-title">{page.informationHeading}</h3>
          <p className="body-text">{page.informationDesc}</p>

          <h3 className="section-title">{page.howWeUse}</h3>
          <p className="body-text">{page.howWeUseDesc}</p>

          <h3 className="section-title">{page.yourRights}</h3>
          <p className="body-text">{page.yourRightsDesc}</p>

          <p className="mt-6"><strong>{page.lastUpdated}</strong></p>
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */