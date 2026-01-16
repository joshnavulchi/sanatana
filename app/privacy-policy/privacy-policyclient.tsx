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
  const [privacy, setPrivacy] = useState({ title: '', lastupdated: '', intro: {} as any, informationwecollect: {} as any, howweuse: {} as any, cookieslocalstorage: {} as any, thirdparty: {} as any, security: {} as any, rights: {} as any, children: {} as any, changes: {} as any, contact:{} as any });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => {});
      } catch (e) {}
      if (!mounted) return;
      const title = t('privacy.title') || '';
      const lastupdated = t('privacy.lastupdated') || '';
      let intro: any = parseMaybeObject(t('privacy.intro'));
      let informationwecollect: any = parseMaybeObject(t('privacy.informationwecollect'));
      let howweuse: any = parseMaybeObject(t('privacy.howweuse'));
      let cookieslocalstorage: any = parseMaybeObject(t('privacy.cookieslocalstorage'));
      let thirdparty: any = parseMaybeObject(t('privacy.thirdparty'));
      let security: any = parseMaybeObject(t('privacy.security'));
      let rights: any = parseMaybeObject(t('privacy.rights'));
      let children: any = parseMaybeObject(t('privacy.children'));
      let changes: any = parseMaybeObject(t('privacy.changes'));
      let contact: any = parseMaybeObject(t('privacy.contact'));
      if (intro && typeof intro === 'object') {
        intro = { title: intro.title, text: intro.text };
      }
      if (informationwecollect && typeof informationwecollect === 'object') {
        informationwecollect = {
          title: informationwecollect.title,
          lead: informationwecollect.lead,
          usagelabel: informationwecollect.usagelabel,
          usage: informationwecollect.usage,
          devicelabel: informationwecollect.devicelabel,
          device: informationwecollect.device,
          cookieslabel: informationwecollect.cookieslabel,
          cookies: informationwecollect.cookies,
          contactlabel: informationwecollect.contactlabel,
          contact: informationwecollect.contact
        };
      }
      // Normalize nested list/object fields that may be returned as JSON strings
      if (howweuse && typeof howweuse === 'object') {
        howweuse.items = parseSections((howweuse as any).items);
      } else {
        // if purpose is plain string, convert to points array
        howweuse = { title: howweuse.title, lead: howweuse.lead, items: parseSections(howweuse) };
      }
      if (cookieslocalstorage && typeof cookieslocalstorage === 'object') {
        cookieslocalstorage = { title: cookieslocalstorage.title, text: cookieslocalstorage.text };
      }
      if (thirdparty && typeof thirdparty === 'object') {
        thirdparty = { title: thirdparty.title, text: thirdparty.text };
      }
      if (security && typeof security === 'object') {
        security = { title: security.title, text: security.text };
      }
      if (rights && typeof rights === 'object') {
        rights.items = parseSections((rights as any).items);
      } else {
        // if purpose is plain string, convert to points array
        rights = {
          title: rights.title,
          lead: rights.lead,
          items: parseSections(rights),
          contacttext: rights.contacttext
        };
      }
      if (children && typeof children === 'object') {
        children = { title: children.title, text: children.text };
      }
      if (changes && typeof changes === 'object') {
        changes = { title: changes.title, text: changes.text };
      }
      if (contact && typeof contact === 'object') {
        contact = {
          title: contact.title,
          lead: contact.lead,
          emaillabel: contact.emaillabel,
          email: contact.email,
          websitelabel: contact.websitelabel,
          website: contact.website,
          closing: contact.closing
        };
      }
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
      <p><strong>{privacy.lastupdated}</strong></p>     
      <section>
        <h2>{privacy.intro.title}</h2>
        <p>{privacy.intro.text}</p>
        <h3><strong>{privacy.informationwecollect.title}</strong> {privacy.informationwecollect.lead}</h3>
        <p><strong>{privacy.informationwecollect.usagelabel}</strong> {privacy.informationwecollect.usage}</p>
        <p><strong>{privacy.informationwecollect.devicelabel}</strong> {privacy.informationwecollect.device}</p>
        <p><strong>{privacy.informationwecollect.cookieslabel}</strong> {privacy.informationwecollect.cookies}</p>
        <p><strong>{privacy.informationwecollect.contactlabel}</strong> {privacy.informationwecollect.contact}</p>
        {/* How we use */}
        <h4>{privacy.howweuse?.title}</h4>
        <p>{privacy.howweuse?.lead}</p>
        <ul className="list-disc">
          {(privacy.howweuse?.items || []).map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <h5>{privacy.cookieslocalstorage.title}</h5>
        <p>{privacy.cookieslocalstorage.text}</p>
        <h6>{privacy.thirdparty.title}</h6>
        <p>{privacy.thirdparty.text}</p>
        <p>{privacy.security.title}</p>
        <p>{privacy.security.text}</p>
        <p>{privacy.rights.title}</p>
        <p>{privacy.rights.lead}</p>
        <ul className="list-disc">
          {(privacy.rights?.items || []).map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <p>{privacy.rights.contacttext}</p>
        <p>{privacy.children.title}</p>
        <p>{privacy.children.text}</p>
        <p>{privacy.changes.title}</p>
        <p>{privacy.changes.text}</p>
        <p>{privacy.contact.title}</p>
        <p>{privacy.contact.lead}</p>
        <p>{privacy.contact.emaillabel} {privacy.contact.email}</p>
        <p>{privacy.contact.websitelabel} {privacy.contact.website}</p>
        <p>{privacy.contact.closing}</p>
      </section>
    </PageLayout>
  );
}
