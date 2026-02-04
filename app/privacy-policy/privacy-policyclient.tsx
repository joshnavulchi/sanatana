"use client";
import React, { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale } from 'lib/i18n';
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

  // Initialize with empty state to avoid hydration mismatch
  const [privacy, setPrivacy] = useState<PrivacyState>(() => {
    return normalizePrivacy({});
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
      <div id="privacy-content" className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <strong className="text-lg text-gray-700 dark:text-gray-300">{privacy.lastupdated}</strong>
          </div>
          <TextToSpeech sectionId="privacy-content" />
        </div>

        {/* Intro */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            {privacy.intro.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{privacy.intro.text}</p>
        </section>

        {/* Information We Collect */}
        <section className="bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <span><strong>{privacy.informationwecollect.title}</strong> {privacy.informationwecollect.lead}</span>
          </h3>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p><strong className="text-amber-800 dark:text-amber-200">{privacy.informationwecollect.usagelabel}</strong> {privacy.informationwecollect.usage}</p>
            <p><strong className="text-amber-800 dark:text-amber-200">{privacy.informationwecollect.devicelabel}</strong> {privacy.informationwecollect.device}</p>
            <p><strong className="text-amber-800 dark:text-amber-200">{privacy.informationwecollect.cookieslabel}</strong> {privacy.informationwecollect.cookies}</p>
            <p><strong className="text-amber-800 dark:text-amber-200">{privacy.informationwecollect.contactlabel}</strong> {privacy.informationwecollect.contact}</p>
          </div>
        </section>

        {/* How We Use */}
        <section className="bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
          <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            {privacy.howweuse?.title}
          </h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{privacy.howweuse?.lead}</p>
          <ul className="space-y-3">
            {(privacy.howweuse?.items || []).map((p: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full" />
                <span className="flex-1">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cookies & Local Storage */}
        <section className="bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
          <h5 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🍪</span>
            {privacy.cookieslocalstorage.title}
          </h5>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{privacy.cookieslocalstorage.text}</p>
        </section>

        {/* Third Party */}
        <section className="bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
          <h6 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🔗</span>
            {privacy.thirdparty.title}
          </h6>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{privacy.thirdparty.text}</p>
        </section>

        {/* Security */}
        <section className="bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🔐</span>
            {privacy.security.title}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{privacy.security.text}</p>
        </section>

        {/* Rights */}
        <section className="bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">⚖️</span>
            {privacy.rights.title}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{privacy.rights.lead}</p>
          <ul className="space-y-3 mb-4">
            {(privacy.rights?.items || []).map((p: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full" />
                <span className="flex-1">{p}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{privacy.rights.contacttext}</p>
        </section>

        {/* Children */}
        <section className="bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">👶</span>
            {privacy.children.title}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{privacy.children.text}</p>
        </section>

        {/* Changes */}
        <section className="bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            {privacy.changes.title}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{privacy.changes.text}</p>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6 md:p-8">
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="text-2xl">📧</span>
            {privacy.contact.title}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{privacy.contact.lead}</p>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong className="text-amber-800 dark:text-amber-200">{privacy.contact.emaillabel}</strong> {privacy.contact.email}</p>
            <p><strong className="text-amber-800 dark:text-amber-200">{privacy.contact.websitelabel}</strong> {privacy.contact.website}</p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-6 pt-4 border-t border-amber-300 dark:border-amber-700">{privacy.contact.closing}</p>
        </section>
      </div>
    </PageLayout>
  );
}
