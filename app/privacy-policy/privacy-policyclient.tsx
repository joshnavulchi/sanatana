"use client";
import React, { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale } from 'lib/i18n';
import { useT } from '../hooks/useT';
import { parseList } from 'lib/parseList';

import styles from './page.module.scss';


function parseSections(raw: any) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // not JSON, fall back to newline parsing
      return parseList(raw);
    }
  }
  return [];
}

function parseMaybeObject(raw: any) {
  if (!raw) return raw;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return raw;
    }
  }
  return raw;
}

export default function PrivacyPolicy() {
  const { locale } = useLocale();
  const t = useT();
  const [privacy, setPrivacy] = useState({ title, lastupdated, intro, informationwecollect, howweuse, cookieslocalstorage, thirdparty, security, rights, children, changes, contact });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => {});
      } catch (e) {}

      if (!mounted) return;
      const title = t('privacy.title') || '';
      const lastupdated = t('privacy.lastupdated') || '';
      const intro =
      const informationwecollect =
      const howweuse =
      const cookieslocalstorage =
      const thirdparty =
      const security =
      const rights =
      const children =
      const changes =
      const contact = 
      setPrivacy({ title, lastupdated, intro, informationwecollect, howweuse, cookieslocalstorage, thirdparty, security, rights, children, changes, contact });
    })();
    return () => { mounted = false; };
  }, [locale]);

  return (
    <PageLayout
      metaKey="privacy"
      title={privacy.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Privacy policy' }]}
      className={`${styles.privacyPage} layout-sm`}
    >
      <p>{privacy.lastupdated}</p>
      {privacy.sections.map((section: any, index: number) => {
        const level = Math.min(index + 2, 6);
        const Tag = `h${level}` as unknown as React.ElementType;
        return (
          <div key={section.id || index}>
            <Tag>{section.title}</Tag>
            {section?.text && <p>{section.text}</p>}
            <ul className="list-disk">
              {section?.bullets && section?.bullets.map((text: string, idx: number) => (
                <li key={idx}>{text}</li>
              ))}
            </ul>
          </div>
        );
      })}
      {privacy.disclaimer && <p><strong>Disclaimer : </strong>{privacy.disclaimer}</p>}
    </PageLayout>
  );
}
