"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';
import DefinitionOfLife from '@components/definitionoflife';

export default function AboutClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('about');


  // Compute about object directly from ns
  const about = {
    title: String(ns?.title || ''),
    intro: String(ns?.intro || ''),
    sections: Array.isArray(ns?.sections) ? ns.sections : [],
    disclaimer: String(ns?.disclaimer || ''),
  };

  // Show loading state if locale is still loading and we have no content
  if (isLoading && !about.title) {
    return (
      <PageLayout
        metaKey="about"
        title={about?.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'About' }]}
        className="layout-sm"
      >
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        metaKey="about"
        title={about.title}
        description={about.intro || ''}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'About' }]}
        className="layout-sm"
      >
        {/* Text-to-Speech Player */}
        <TextToSpeech sectionId="about-content" className="floating" />

        <div id="about-content">
          {/* Hero intro section */}
          <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500 animate-ping" />
                <span className="text-3xl animate-pulse">🙏</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500 animate-bounce" />
              </div>

              <p className="text-lg md:text-md leading-relaxed">
                {about.intro}
              </p>
            </div>
          </div>

          {/* Sections as cards */}
          {about.sections.map((section: any, index: number) => {
            const level = Math.min(index + 2, 6);
            const Tag = `h${level}` as unknown as React.ElementType;

            // Icon mapping for different section types
            const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
            const icon = icons[index % icons.length];

            return (
              <div key={section.id || index}
                className="relative bg-white border-2 border-amber-100 rounded-2xl p-6 md:p-8
                mt-12 shadow-md hover:shadow-xl transition-all duration-500 group overflow-hidden">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-bl-2xl" />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Section header with icon */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12
                    bg-gradient-to-br from-amber-100 to-orange-100
                    rounded-xl flex items-center justify-center
                    text-2xl shadow-md group-hover:scale-110 group-hover:rotate-6
                    transition-transform duration-300">
                      {icon}
                    </div>
                    <Tag className="flex-1 text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                      {section.title}
                    </Tag>
                  </div>

                  {/* Section text */}
                  {section?.text && (
                    <p className="text-lg md:text-md leading-relaxed ">
                      {section.text}
                    </p>
                  )}

                  {/* Bullets list */}
                  {section?.bullets && section?.bullets.length > 0 && (
                    <ul className="space-y-3 ">
                      {section.bullets.map((text: string, idx: number) => (
                        <li key={idx} className="relative flex items-start gap-3 leading-relaxed">
                          <span className="flex-shrink-0 w-2 h-2 mt-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full" />
                          <span className="flex-1">{text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}

          {/* Disclaimer section */}
          {about.disclaimer && (
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-6 md:p-8 mt-12 shadow-lg">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Disclaimer</h4>
                  <p className="text-lg md:text-md leading-relaxed">
                    {about.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageLayout>
      <div className="mt-16">
        <DefinitionOfLife />
      </div>
    </>
  );
}
// Content of AboutClient.tsx can be added here, depending on the actual code. This is just a placeholder.