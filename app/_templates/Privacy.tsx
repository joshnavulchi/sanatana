"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface PrivacyTemplateProps {
  data: {
    title: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
    lastUpdated?: string;
  };
}

const PrivacyTemplate: React.FC<PrivacyTemplateProps> = ({ data }) => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-gradient-radial from-gray-100 via-white to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-3xl mx-auto py-16 px-6">
        <div className="relative mb-10">
          <div className="absolute inset-0 blur-2xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, #64748b 0%, transparent 70%)' }} />
          <h1 className="relative z-10 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 dark:from-gray-200 dark:via-gray-400 dark:to-gray-500 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.lastUpdated && (
            <p className="relative z-10 text-base md:text-md text-gray-500 dark:text-gray-400 mb-6">{t('privacy.last_updated')}: {data.lastUpdated}</p>
          )}
        </div>
        <div className="space-y-10">
          {data.sections.map((section, idx) => (
            <article key={idx} className="bg-gradient-to-br from-white via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8 hover:scale-[1.02] transition-transform duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">{section.heading}</h2>
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-md whitespace-pre-line leading-relaxed">{section.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PrivacyTemplate;
