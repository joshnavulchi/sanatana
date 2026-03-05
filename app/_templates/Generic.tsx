"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface GenericTemplateProps {
  data: {
    title: string;
    description?: string;
    items: Array<{
      name: string;
      summary: string;
      image?: string;
      link?: string;
    }>;
    color?: string; // e.g. 'indigo', 'emerald', 'rose', etc.
  };
}

const colorMap: Record<string, string> = {
  indigo: 'from-indigo-100 via-white to-indigo-300 dark:from-indigo-900 dark:via-gray-900 dark:to-indigo-800',
  emerald: 'from-emerald-100 via-white to-emerald-300 dark:from-emerald-900 dark:via-gray-900 dark:to-emerald-800',
  rose: 'from-rose-100 via-white to-rose-300 dark:from-rose-900 dark:via-gray-900 dark:to-rose-800',
  sky: 'from-sky-100 via-white to-sky-300 dark:from-sky-900 dark:via-gray-900 dark:to-sky-800',
  yellow: 'from-yellow-100 via-white to-yellow-300 dark:from-yellow-900 dark:via-gray-900 dark:to-yellow-800',
  gray: 'from-gray-100 via-white to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700',
};

const GenericTemplate: React.FC<GenericTemplateProps> = ({ data }) => {
  const { t } = useLocale();
  const bgClass = colorMap[data.color || 'gray'];
  return (
    <main className={`min-h-screen bg-gradient-radial ${bgClass} flex items-center justify-center transition-colors duration-300`}>
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{background: `radial-gradient(circle at 60% 40%, var(--tw-gradient-stops))`}} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 dark:from-gray-200 dark:via-gray-400 dark:to-gray-500 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.description && (
            <p className="relative z-10 text-md md:text-2xl text-gray-700 dark:text-gray-200 mb-8 font-medium tracking-wide">{data.description}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, idx) => (
            <article key={idx} className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-gray-400 dark:hover:shadow-gray-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-gray-300 via-gray-400 to-gray-500 dark:from-gray-900 dark:via-gray-700 dark:to-gray-800 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {item.image && (
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-gray-200 dark:border-gray-700 shadow-lg" />
              )}
              <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 mb-3 text-center drop-shadow-md">{item.name}</h2>
              <p className="text-gray-700 dark:text-gray-100 text-base text-center leading-relaxed mb-2">{item.summary}</p>
              {item.link && (
                <a href={item.link} className="text-gray-600 dark:text-gray-300 underline mt-2" target="_blank" rel="noopener noreferrer">{t('generic.learn_more')}</a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default GenericTemplate;
