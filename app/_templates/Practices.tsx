"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface PracticesTemplateProps {
  data: {
    title: string;
    description?: string;
    practices: Array<{
      name: string;
      summary: string;
      image?: string;
      link?: string;
    }>;
  };
}

const PracticesTemplate: React.FC<PracticesTemplateProps> = ({ data }) => {
  const { t } = useLocale();
  return (
    <main className="min-h-screen bg-gradient-radial from-teal-100 via-white to-teal-300 dark:from-teal-900 dark:via-gray-900 dark:to-teal-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 40%, #14b8a6 0%, transparent 70%)' }} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-cyan-500 to-green-400 dark:from-teal-200 dark:via-cyan-300 dark:to-green-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.description && (
            <p className="relative z-10 text-xl md:text-lg text-teal-700 dark:text-teal-200 mb-8 font-medium tracking-wide">{data.description}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.practices.map((practice, idx) => (
            <article key={idx} className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-teal-950 dark:to-cyan-900 border-2 border-teal-200 dark:border-teal-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-teal-400 dark:hover:shadow-teal-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-green-300 via-cyan-300 to-teal-400 dark:from-green-900 dark:via-cyan-900 dark:to-teal-900 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {practice.image && (
                <img src={practice.image} alt={practice.name} className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-teal-200 dark:border-teal-700 shadow-lg" />
              )}
              <h2 className="text-2xl font-extrabold text-teal-800 dark:text-teal-200 mb-3 text-center drop-shadow-md">{practice.name}</h2>
              <p className="text-teal-700 dark:text-teal-100 text-base md:text-md text-center leading-relaxed mb-2">{practice.summary}</p>
              {practice.link && (
                <a href={practice.link} className="text-teal-600 dark:text-teal-300 underline mt-2" target="_blank" rel="noopener noreferrer">{t('practices.learn_more')}</a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PracticesTemplate;
