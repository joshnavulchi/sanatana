/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('home');

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  // Single `page_title` object used across the page: prefers `locales/*/about.json` values
  const about: any = (() => {
    const k: any = 'about';
    const arr = (p: any) => {
      if (Array.isArray(p)) return p;
      if (p == null) return [];
      return [String(p)];
    };
    return {
      title: String(t('about.title', locale) || ''),
      description: String(t('about.description', locale) || ''),
      vision: {
        description: String(t('about.vision.description', locale) || ''),
        focusAreas: (t('about.vision.focusAreas', locale) as string[]),
        goal: String(t('about.vision.goal', locale) || '')
      },
      whyWeCreated: {
        purpose: String(t('about.whyWeCreated.purpose', locale) || ''),
        problemsAddressed: (t('about.whyWeCreated.problemsAddressed', locale) as string[])
      },
      commitment: (t('about.commitment', locale) as string[]),
      joinUs: {
        message: String(t('about.joinUs.message', locale) || ''),
        invite: (t('about.joinUs.invite', locale) as string[])
      },
      disclaimer: String(t('about.disclaimer', locale) || '')
    };
  })();
  return (
    <PageLayout
      metaKey="about"
      title={about.title}
      breadcrumbs={[
        { labelKey: 'nav.home', href: '/' },
        { label: 'About' }]}
      className="sm"
    >
      <p>Vijay {about.description}</p>
      <div>
        <h2>Vision</h2>
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
        <h3>Why we created this</h3>
        <p>{about.whyWeCreated.purpose}</p>
        <ul role="list" className="list-disc">
          {(about.whyWeCreated.problemsAddressed as string[]).map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4>Commitment</h4>
        <ul role="list" className="list-disc">
          {(about.commitment as string[]).map((c: string, i: number) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {about.joinUs.message && (
        <div>
          <h5>Join us</h5>
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