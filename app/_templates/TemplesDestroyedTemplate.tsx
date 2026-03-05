"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface TemplesDestroyedTemplateProps {
  data: {
    title: string;
    description?: string;
    temples: Array<{
      name: string;
      summary: string;
      image?: string;
      link?: string;
    }>;
  };
}

const TemplesDestroyedTemplate: React.FC<TemplesDestroyedTemplateProps> = ({ data }) => {
  const { t } = useLocale();
  return (
    <main className="min-h-screen bg-gradient-radial from-red-100 via-white to-red-300 dark:from-red-900 dark:via-gray-900 dark:to-red-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 60% 40%, #ef4444 0%, transparent 70%)'}} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-orange-500 to-yellow-400 dark:from-red-200 dark:via-orange-300 dark:to-yellow-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.description && (
            <p className="relative z-10 text-md md:text-2xl text-red-700 dark:text-red-200 mb-8 font-medium tracking-wide">{data.description}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.temples.map((temple, idx) => (
            <article key={idx} className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-red-50 to-orange-100 dark:from-gray-900 dark:via-red-950 dark:to-orange-900 border-2 border-red-200 dark:border-red-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-red-400 dark:hover:shadow-red-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-yellow-300 via-red-300 to-orange-400 dark:from-yellow-900 dark:via-red-900 dark:to-orange-900 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {temple.image && (
                <img src={temple.image} alt={temple.name} className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-red-200 dark:border-red-700 shadow-lg" />
              )}
              <h2 className="text-2xl font-extrabold text-red-800 dark:text-red-200 mb-3 text-center drop-shadow-md">{temple.name}</h2>
              <p className="text-red-700 dark:text-red-100 text-base text-center leading-relaxed mb-2">{temple.summary}</p>
              {temple.link && (
                <a href={temple.link} className="text-red-600 dark:text-red-300 underline mt-2" target="_blank" rel="noopener noreferrer">{t('templesdestroyed.learn_more')}</a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TemplesDestroyedTemplate;
