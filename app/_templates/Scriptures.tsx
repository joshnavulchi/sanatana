"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface ScripturesTemplateProps {
  data: {
    title: string;
    description?: string;
    scriptures: Array<{
      name: string;
      summary: string;
      image?: string;
      link?: string;
    }>;
  };
}

const ScripturesTemplate: React.FC<ScripturesTemplateProps> = ({ data }) => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-gradient-radial from-purple-100 via-white to-purple-300 dark:from-purple-900 dark:via-gray-900 dark:to-purple-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 60% 40%, #a78bfa 0%, transparent 70%)'}} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-400 dark:from-purple-200 dark:via-pink-300 dark:to-indigo-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.description && (
            <p className="relative z-10 text-md md:text-2xl text-purple-700 dark:text-purple-200 mb-8 font-medium tracking-wide">{data.description}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.scriptures.map((scripture, idx) => (
            <article key={idx} className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-950 dark:to-pink-900 border-2 border-purple-200 dark:border-purple-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-purple-400 dark:hover:shadow-purple-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {scripture.image && (
                <img src={scripture.image} alt={scripture.name} className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-purple-200 dark:border-purple-700 shadow-lg" />
              )}
              <h2 className="text-2xl font-extrabold text-purple-800 dark:text-purple-200 mb-3 text-center drop-shadow-md">{scripture.name}</h2>
              <p className="text-purple-700 dark:text-purple-100 text-base text-center leading-relaxed mb-2">{scripture.summary}</p>
              {scripture.link && (
                <a href={scripture.link} className="text-purple-600 dark:text-purple-300 underline mt-2" target="_blank" rel="noopener noreferrer">{t('scriptures.read_more')}</a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ScripturesTemplate;
