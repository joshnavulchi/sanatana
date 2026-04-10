"use client";

import { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import TextToSpeech from '@/app/components/TextToSpeech';
import PageLayout from '@components/common/PageLayout';
import { normalizePolicyContent, type PolicyContentState } from '@lib/policyNormalizer';

export default function PrivacyPolicy() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('privacy-policy');
  type PrivacyState = PolicyContentState;
  const normalizePrivacy = (src: unknown): PrivacyState => {
    try {
      return normalizePolicyContent(src);
    } catch {
      return {
        title: '',
        lastupdated: '',
        intro: {} as any,
        informationwecollect: {} as any,
        howweuse: {} as any,
        cookieslocalstorage: {} as any,
        thirdparty: {} as any,
        security: {} as any,
        rights: {} as any,
        children: {} as any,
        changes: {} as any,
        contact: {} as any,
      };
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
        // Locale loading is now handled by context/useLocaleSection
      } catch (e) { }
      if (!mounted) return;

      setPrivacy(normalizePrivacy(ns || {}));
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !privacy.title) {
    return (
      <PageLayout
        metaKey="privacy-policy"
        title=""
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Privacy Policy' }]}
        className="layout-md bg-gradient-to-br from-[#f7e8ff] via-[#e0c3fc] to-[#8ec5fc] min-h-screen animate-fade-in">
        <div className="flex items-center justify-center py-16">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="privacy-policy"
      title={privacy.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Privacy policy' }]}
      className="layout-md bg-gradient-to-br from-[#f7e8ff] via-[#e0c3fc] to-[#8ec5fc] min-h-screen animate-fade-in">
      <div id="privacy-content" className="space-y-10 text-md sm:text-base leading-relaxed font-normal">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 md:pb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-[#a259ec] animate-bounce">🔒</span>
            <strong className="text-2xl font-bold text-[#7f53ac] drop-shadow">{privacy.lastupdated}</strong>
          </div>
          <TextToSpeech sectionId="privacy-content" className="floating" />
        </div>

        {/* Intro */}
        <section className="rounded-3xl p-6 md:p-12 bg-white/80 shadow-2xl border border-[#e0c3fc]/40 backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
          <h3 className="flex items-center gap-3 text-3xl font-extrabold leading-snug mb-4 text-[#7f53ac]">
            <span className="text-2xl">🛡️</span>
            {privacy.intro.title}
          </h3>
          <p className="text-lg leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.intro.text}</p>
        </section>

        {/* Information We Collect */}
        <section className="rounded-3xl p-6 md:p-12 bg-gradient-to-br from-[#e0c3fc]/80 via-[#f7e8ff]/80 to-[#8ec5fc]/80 shadow-xl border border-[#e0c3fc]/30 backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
          <h4 className="flex items-center gap-3 text-2xl font-bold leading-snug mb-3 text-[#7f53ac]">
            <span className="text-2xl">📊</span>
            <span>{privacy.informationwecollect.title} {privacy.informationwecollect.lead}</span>
          </h4>
          <div className="space-y-4 text-md sm:text-base leading-relaxed font-normal">
            <p><strong className="text-[#a259ec]">{privacy.informationwecollect.usagelabel}</strong> {privacy.informationwecollect.usage}</p>
            <p><strong className="text-[#a259ec]">{privacy.informationwecollect.devicelabel}</strong> {privacy.informationwecollect.device}</p>
            <p><strong className="text-[#a259ec]">{privacy.informationwecollect.cookieslabel}</strong> {privacy.informationwecollect.cookies}</p>
            <p><strong className="text-[#a259ec]">{privacy.informationwecollect.contactlabel}</strong> {privacy.informationwecollect.contact}</p>
          </div>
        </section>

        {/* How We Use */}
        <section className="rounded-3xl p-6 md:p-12 bg-white/80 shadow-2xl border border-[#e0c3fc]/40 backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
          <h4 className="text-2xl font-bold text-[#7f53ac] mb-4 flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            {privacy.howweuse?.title}
          </h4>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.howweuse?.lead}</p>
          <ul className="space-y-3 list-disc pl-5 text-md sm:text-base leading-relaxed">
            {(privacy.howweuse?.items || []).map((p: string, i: number) => (
              <li key={i} className="flex items-start gap-3 mb-2">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#a259ec]" />
                <span className="flex-1">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cookies & Local Storage */}
        <section className="rounded-3xl p-6 md:p-12 bg-gradient-to-br from-[#f7e8ff]/80 via-[#e0c3fc]/80 to-[#8ec5fc]/80 shadow-xl border border-[#e0c3fc]/30 backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
          <h5 className="text-2xl font-bold text-[#7f53ac] mb-4 flex items-center gap-3">
            <span className="text-2xl">🍪</span>
            {privacy.cookieslocalstorage.title}
          </h5>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.cookieslocalstorage.text}</p>
        </section>

        {/* Third Party */}
        <section className="rounded-3xl p-6 md:p-12 bg-white/80 shadow-2xl border border-[#e0c3fc]/40 backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
          <h6 className="text-2xl font-bold text-[#7f53ac] mb-4 flex items-center gap-3">
            <span className="text-2xl">🔗</span>
            {privacy.thirdparty.title}
          </h6>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.thirdparty.text}</p>
        </section>

        {/* Security */}
        <section className="rounded-3xl p-6 md:p-12 bg-gradient-to-br from-[#e0c3fc]/80 via-[#f7e8ff]/80 to-[#8ec5fc]/80 shadow-xl border border-[#e0c3fc]/30 backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
          <p className="flex items-center gap-3 text-2xl font-bold text-[#7f53ac] mb-4">
            <span className="text-2xl">🔐</span>
            {privacy.security.title}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.security.text}</p>
        </section>

        {/* Rights */}
        <section className="rounded-3xl p-6 md:p-12 bg-white/80 shadow-2xl border border-[#e0c3fc]/40 backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
          <p className="flex items-center gap-3 text-2xl font-bold text-[#7f53ac] mb-4">
            <span className="text-2xl">⚖️</span>
            {privacy.rights.title}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.rights.lead}</p>
          <ul className="space-y-3 list-disc pl-5 text-md sm:text-base leading-relaxed">
            {(privacy.rights?.items || []).map((p: string, i: number) => (
              <li key={i} className="flex items-start gap-3 mb-2">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#a259ec]" />
                <span className="flex-1">{p}</span>
              </li>
            ))}
          </ul>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.rights.contacttext}</p>
        </section>

        {/* Children */}
        <section className="rounded-3xl p-6 md:p-12 bg-gradient-to-br from-[#f7e8ff]/80 via-[#e0c3fc]/80 to-[#8ec5fc]/80 shadow-xl border border-[#e0c3fc]/30 backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
          <p className="flex items-center gap-3 text-2xl font-bold text-[#7f53ac] mb-4">
            <span className="text-2xl">👶</span>
            {privacy.children.title}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.children.text}</p>
        </section>

        {/* Changes */}
        <section className="rounded-3xl p-6 md:p-12 bg-white/80 shadow-2xl border border-[#e0c3fc]/40 backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
          <p className="flex items-center gap-3 text-2xl font-bold text-[#7f53ac] mb-4">
            <span className="text-2xl">🔄</span>
            {privacy.changes.title}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.changes.text}</p>
        </section>

        {/* Contact */}
        <section className="rounded-3xl p-6 md:p-12 bg-gradient-to-br from-[#e0c3fc]/80 via-[#f7e8ff]/80 to-[#8ec5fc]/80 shadow-xl border border-[#e0c3fc]/30 backdrop-blur-md transition-all duration-500 hover:scale-[1.01]">
          <p className="flex items-center gap-3 text-2xl font-bold text-[#7f53ac] mb-4">
            <span className="text-2xl">📧</span>
            {privacy.contact.title}
          </p>
          <p className="text-md sm:text-base leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.contact.lead}</p>
          <div className="space-y-2 text-md sm:text-base leading-relaxed font-normal">
            <p><strong className="text-[#a259ec]">{privacy.contact.emaillabel}</strong> {privacy.contact.email}</p>
            <p><strong className="text-[#a259ec]">{privacy.contact.websitelabel}</strong> {privacy.contact.website}</p>
          </div>
          <p className="pt-4 text-md sm:text-base leading-relaxed mb-4 font-medium text-[#4b3869]">{privacy.contact.closing}</p>
        </section>
      </div>
    </PageLayout>
  );
}

