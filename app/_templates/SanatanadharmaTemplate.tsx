"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface SanatanadharmaTemplateProps {
  data: {
    title: string;
    description?: string;
    items: Array<{
      name: string;
      summary: string;
      image?: string;
      link?: string;
    }>;
  };
}

const SanatanadharmaTemplate: React.FC<SanatanadharmaTemplateProps> = ({ data }) => {
  const { t } = useLocale();
  return (
    <main className="min-h-screen bg-gradient-radial from-yellow-100 via-white to-amber-300 dark:from-yellow-900 dark:via-gray-900 dark:to-amber-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 40%, #fbbf24 0%, transparent 70%)' }} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-amber-500 to-orange-400 dark:from-yellow-200 dark:via-amber-300 dark:to-orange-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.description && (
            <p className="relative z-10 text-xl md:text-lg text-yellow-700 dark:text-yellow-200 mb-8 font-medium tracking-wide">{data.description}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, idx) => (
            <article key={idx} className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-yellow-50 to-amber-100 dark:from-gray-900 dark:via-yellow-950 dark:to-amber-900 border-2 border-yellow-200 dark:border-yellow-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-yellow-400 dark:hover:shadow-yellow-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-orange-300 via-amber-300 to-yellow-400 dark:from-orange-900 dark:via-amber-900 dark:to-yellow-900 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {item.image && (
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-yellow-200 dark:border-yellow-700 shadow-lg" />
              )}
              <h2 className="text-2xl font-extrabold text-yellow-800 dark:text-yellow-200 mb-3 text-center drop-shadow-md">{item.name}</h2>
              <p className="text-yellow-700 dark:text-yellow-100 text-base md:text-md text-center leading-relaxed mb-2">{item.summary}</p>
              {item.link && (
                <a href={item.link} className="text-yellow-600 dark:text-yellow-300 underline mt-2" target="_blank" rel="noopener noreferrer">{t('sanatanadharma.learn_more')}</a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default SanatanadharmaTemplate;
