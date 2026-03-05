"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface WorldTransformationTemplateProps {
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

const WorldTransformationTemplate: React.FC<WorldTransformationTemplateProps> = ({ data }) => {
  const { t } = useLocale();
  return (
    <main className="min-h-screen bg-gradient-radial from-cyan-100 via-white to-cyan-300 dark:from-cyan-900 dark:via-gray-900 dark:to-cyan-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 40%, #06b6d4 0%, transparent 70%)' }} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-blue-500 to-green-400 dark:from-cyan-200 dark:via-blue-300 dark:to-green-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.description && (
            <p className="relative z-10 text-md md:text-2xl text-cyan-700 dark:text-cyan-200 mb-8 font-medium tracking-wide">{data.description}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, idx) => (
            <article key={idx} className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-cyan-950 dark:to-blue-900 border-2 border-cyan-200 dark:border-cyan-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-cyan-400 dark:hover:shadow-cyan-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-green-300 via-blue-300 to-cyan-400 dark:from-green-900 dark:via-blue-900 dark:to-cyan-900 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {item.image && (
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-cyan-200 dark:border-cyan-700 shadow-lg" />
              )}
              <h2 className="text-2xl font-extrabold text-cyan-800 dark:text-cyan-200 mb-3 text-center drop-shadow-md">{item.name}</h2>
              <p className="text-cyan-700 dark:text-cyan-100 text-base text-center leading-relaxed mb-2">{item.summary}</p>
              {item.link && (
                <a href={item.link} className="text-cyan-600 dark:text-cyan-300 underline mt-2" target="_blank" rel="noopener noreferrer">{t('worldtransformation.learn_more')}</a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default WorldTransformationTemplate;
