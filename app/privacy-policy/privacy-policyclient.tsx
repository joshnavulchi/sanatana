"use client";
import React, { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale, getLocaleObject } from 'lib/i18n';
import useLocaleSection from '../hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from 'lib/parseContent';
import Loader from '@/app/components/loader/loader';
import TextToSpeech from '../components/text-to-speech/TextToSpeech';

export default function PrivacyPolicy() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('privacy_policy');
  type PrivacyState = { title: string; lastupdated: string;[key: string]: any };
  // Normalize a source object (either server-injected locale or the loaded namespace)
  const normalizePrivacy = (src: any): PrivacyState => {
    const safe = src || {};
    try {
      const title = safe.title || '';
      const lastupdated = safe.lastupdated || '';
      const keys = ['intro', 'informationwecollect', 'howweuse', 'cookieslocalstorage', 'thirdparty', 'security', 'rights', 'children', 'changes', 'contact'];
      const data: Record<string, any> = {};
      keys.forEach((k) => { data[k] = parseMaybeObject(safe[k] || ''); });

      if (data.intro && typeof data.intro === 'object') data.intro = { title: data.intro.title, text: data.intro.text };

      if (data.informationwecollect && typeof data.informationwecollect === 'object') {
        const iw = data.informationwecollect;
        data.informationwecollect = {
          title: iw.title,
          lead: iw.lead,
          usagelabel: iw.usagelabel,
          usage: iw.usage,
          devicelabel: iw.devicelabel,
          device: iw.device,
          cookieslabel: iw.cookieslabel,
          cookies: iw.cookies,
          contactlabel: iw.contactlabel,
          contact: iw.contact
        };
      } else {
        data.informationwecollect = { title: '', lead: '', usagelabel: '', usage: '', devicelabel: '', device: '', cookieslabel: '', cookies: '', contactlabel: '', contact: '' };
      }

      if (data.howweuse && typeof data.howweuse === 'object') {
        data.howweuse.items = parseSections(data.howweuse.items);
      } else {
        data.howweuse = { title: data.howweuse?.title, lead: data.howweuse?.lead, items: parseSections(data.howweuse) };
      }

      ['cookieslocalstorage', 'thirdparty', 'security', 'children', 'changes'].forEach((k) => {
        if (data[k] && typeof data[k] === 'object') data[k] = { title: data[k].title, text: data[k].text };
        else data[k] = { title: '', text: '' };
      });

      if (data.rights && typeof data.rights === 'object') {
        data.rights.items = parseSections(data.rights.items);
      } else {
        data.rights = { title: data.rights?.title, lead: data.rights?.lead, items: parseSections(data.rights), contacttext: data.rights?.contacttext };
      }

      if (data.contact && typeof data.contact === 'object') {
        const c = data.contact;
        data.contact = { title: c.title, lead: c.lead, emaillabel: c.emaillabel, email: c.email, websitelabel: c.websitelabel, website: c.website, closing: c.closing };
      } else {
        data.contact = { title: '', lead: '', emaillabel: '', email: '', websitelabel: '', website: '', closing: '' };
      }

      return { title, lastupdated, ...data };
    } catch (e) {
      return { title: '', lastupdated: '', intro: {} as any, informationwecollect: {} as any, howweuse: {} as any, cookieslocalstorage: {} as any, thirdparty: {} as any, security: {} as any, rights: {} as any, children: {} as any, changes: {} as any, contact: {} as any };
    }
  };

  const [privacy, setPrivacy] = useState<PrivacyState>(() => {
    const localeObj = getLocaleObject(locale) as any;
    return normalizePrivacy(localeObj?.privacy_policy || {});
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => { });
      } catch (e) { }
      if (!mounted) return;

      setPrivacy(normalizePrivacy(ns || {}));
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !privacy.title) {
    return (
      <PageLayout metaKey="privacy_policy.meta" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Privacy Policy' }]} className="layout-sm">
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="privacy_policy.meta"
      title={privacy.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Privacy policy' }]}
      className={`layout-sm`}
    >
      <div id="privacy-content">
        <p className="flex items-center justify-between">
          <strong>{privacy.lastupdated}</strong>
          {/* Text-to-Speech Player */}
          <TextToSpeech sectionId="privacy-content" />
        </p>
        <section>
          <h2 className="h4">{privacy.intro.title}</h2>
          <p>{privacy.intro.text}</p>
          <h3 className="h4"><strong>{privacy.informationwecollect.title}</strong> {privacy.informationwecollect.lead}</h3>
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
          <h5 className="h4">{privacy.cookieslocalstorage.title}</h5>
          <p>{privacy.cookieslocalstorage.text}</p>
          <h6 className="h4">{privacy.thirdparty.title}</h6>
          <p>{privacy.thirdparty.text}</p>
          <p className="h4">{privacy.security.title}</p>
          <p>{privacy.security.text}</p>
          <p className="h4">{privacy.rights.title}</p>
          <p>{privacy.rights.lead}</p>
          <ul className="list-disc">
            {(privacy.rights?.items || []).map((p: string, i: number) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
          <p>{privacy.rights.contacttext}</p>
          <p className="h4">{privacy.children.title}</p>
          <p>{privacy.children.text}</p>
          <p className="h4">{privacy.changes.title}</p>
          <p>{privacy.changes.text}</p>
          <p className="h4">{privacy.contact.title}</p>
          <p>{privacy.contact.lead}</p>
          <p>{privacy.contact.emaillabel} {privacy.contact.email}</p>
          <p>{privacy.contact.websitelabel} {privacy.contact.website}</p>
          <p>{privacy.contact.closing}</p>
        </section>
      </div>
    </PageLayout>
  );
}
