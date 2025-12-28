/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../lib/i18n';

import { resolveLocaleFromHeaders, createcreateGenerateMetadata } from '../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';

export const generateMetadata = createcreateGenerateMetadata('about', 'about.title', 'about.description');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();

  // Single `page_title` object used across the page: prefers `locales/*/about.json` values
  const about: any = (() => {
    const k: any = getMeta('about', {}, locale) || {};
    const arr = (p: any) => {
      if (Array.isArray(p)) return p;
      if (p == null) return [];
      return [String(p)];
    };

    return {
      title: k.title || String(t('about.title', locale) || ''),
      description: k.description || String(t('about.description', locale) || ''),
      vision: {
        description: (k.vision && k.vision.description) || String(t('about.vision.description', locale) || ''),
        focusAreas: Array.isArray(k?.vision?.focusAreas) ? k.vision.focusAreas : (Array.isArray(t('about.vision.focusAreas', locale)) ? (t('about.vision.focusAreas', locale) as string[]) : arr(t('about.vision.focusAreas', locale))),
        goal: (k.vision && k.vision.goal) || String(t('about.vision.goal', locale) || '')
      },
      whyWeCreated: {
        purpose: k['whyWeCreated']?.purpose || String(t('about.whyWeCreated.purpose', locale) || ''),
        problemsAddressed: Array.isArray(k['whyWeCreated']?.problemsAddressed) ? k['whyWeCreated'].problemsAddressed : (Array.isArray(t('about.whyWeCreated.problemsAddressed', locale)) ? (t('about.whyWeCreated.problemsAddressed', locale) as string[]) : arr(t('about.whyWeCreated.problemsAddressed', locale)))
      },
      commitment: Array.isArray(k.commitment) ? k.commitment : (Array.isArray(t('about.commitment', locale)) ? (t('about.commitment', locale) as string[]) : arr(t('about.commitment', locale))),
      joinUs: {
        message: k.joinUs?.message || String(t('about.joinUs.message', locale) || ''),
        invite: Array.isArray(k.joinUs?.invite) ? k.joinUs.invite : (Array.isArray(t('about.joinUs.invite', locale)) ? (t('about.joinUs.invite', locale) as string[]) : arr(t('about.joinUs.invite', locale)))
      },
      disclaimer: k.disclaimer || String(t('about.disclaimer', locale) || '')
    };
  })();

  return (
    <PageLayout metaKey="about" title={about.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: (about.title || '') }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
      <p>{about.description}</p>
      <div>
        <h3>Vision</h3>
        <p>{about.vision.description}</p>
        {Array.isArray(about.vision.focusAreas) && (
          <ul role="list" className="list-disc">
            {about.vision.focusAreas.map((f: string, i: number) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}
        {about.vision.goal && <p><strong>Goal:</strong> {about.vision.goal}</p>}
      </div>

      <div>
        <h4>Why we created this</h4>
        <p>{about.whyWeCreated.purpose}</p>
        <ul role="list" className="list-disc">
          {(about.whyWeCreated.problemsAddressed as string[]).map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div>
        <h5>Commitment</h5>
        <ul role="list" className="list-disc">
          {(about.commitment as string[]).map((c: string, i: number) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {about.joinUs.message && (
        <div>
          <h6>Join us</h6>
          <p>{about.joinUs.message}</p>
          {Array.isArray(about.joinUs.invite) && (
            <ul role="list" className="list-disc">
              {about.joinUs.invite.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
            </ul>
          )}
        </div>
      )}

      {about.disclaimer && <p>{about.disclaimer}</p>}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */