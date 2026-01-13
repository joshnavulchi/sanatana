/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';
import { JSX } from 'react';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
export const generateMetadata = createGenerateMetadata('about');

import styles from './page.module.scss';

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
      intro: String(t('about.intro', locale) || ''),
      sections: t('about.sections', locale) || '',
      // vision: {
      //   description: String(t('about.vision.description', locale) || ''),
      //   focusAreas: (t('about.vision.focusAreas', locale) as string[]),
      //   goal: String(t('about.vision.goal', locale) || '')
      // },
      // whyWeCreated: {
      //   purpose: String(t('about.whywecreated.purpose', locale) || ''),
      //   problemsAddressed: (t('about.whywecreated.problemsaddressed', locale) as string[])
      // },
      // commitment: (t('about.commitment', locale) as string[]),
      // joinUs: {
      //   message: String(t('about.joinus.message', locale) || ''),
      //   invite: (t('about.joinus.invite', locale) as string[])
      // },
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
      className={`${styles.aboutPage} layout-sm`}
    >
      <p>{about.intro}</p>
      {about.sections.map((section: any, index: number) => {
        const level = Math.min(index + 2, 6);
        const Tag = `h${level}` as keyof JSX.IntrinsicElements
        return (
          <>
            <Tag className={`title`}>{section.title}</Tag>
            {section?.text && <p>{section.text}</p>}
            <ul className="list-disk">
              {section?.bullets && section?.bullets.map((text: string, idx: number) =>
                <li key={idx}>{text}</li>
              )}
            </ul>
          </>);
      })}
      {/* <div>
        <h3 className={styles.subtitle}>Why we created this</h3>
        <p>{about.whyWeCreated.purpose}</p>
        <ul role="list" className="list-disc">
          {(about.whyWeCreated.problemsAddressed as string[]).map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className={styles.subtitle}>Commitment</h4>
        <ul role="list" className="list-disc">
          {(about.commitment as string[]).map((c: string, i: number) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {about.joinUs.message && (
        <div>
          <h5 className={styles.subtitle}>Join us</h5>
          <p>{about.joinUs.message}</p>
          {Array.isArray(about.joinUs.invite) && (
            <ul role="list" className="list-disc">
              {about.joinUs.invite.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
            </ul>
          )}
        </div>
      )} */}

      {about.disclaimer && <p><strong>Disclaimer : </strong>{about.disclaimer}</p>}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */