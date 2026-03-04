"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface ShaktiPeethasTemplateProps {
  data: {
    title: string;
    description?: string;
    peethas: Array<{
      name: string;
      summary: string;
      image?: string;
      link?: string;
    }>;
  };
}

const ShaktiPeethasTemplate: React.FC<ShaktiPeethasTemplateProps> = ({ data }) => {
  const { t } = useLocale();
  return (
    <main className="min-h-screen bg-gradient-radial from-pink-100 via-white to-pink-300 dark:from-pink-900 dark:via-gray-900 dark:to-pink-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 60% 40%, #f472b6 0%, transparent 70%)'}} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-700 via-red-500 to-yellow-400 dark:from-pink-200 dark:via-red-300 dark:to-yellow-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.description && (
            <p className="relative z-10 text-xl md:text-2xl text-pink-700 dark:text-pink-200 mb-8 font-medium tracking-wide">{data.description}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.peethas.map((peetha, idx) => (
            <article key={idx} className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-pink-50 to-yellow-100 dark:from-gray-900 dark:via-pink-950 dark:to-yellow-900 border-2 border-pink-200 dark:border-pink-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-pink-400 dark:hover:shadow-pink-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-yellow-300 via-pink-300 to-red-400 dark:from-yellow-900 dark:via-pink-900 dark:to-red-900 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {peetha.image && (
                <img src={peetha.image} alt={peetha.name} className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-pink-200 dark:border-pink-700 shadow-lg" />
              )}
              <h2 className="text-2xl font-extrabold text-pink-800 dark:text-pink-200 mb-3 text-center drop-shadow-md">{peetha.name}</h2>
              <p className="text-pink-700 dark:text-pink-100 text-base text-center leading-relaxed mb-2">{peetha.summary}</p>
              {peetha.link && (
                <a href={peetha.link} className="text-pink-600 dark:text-pink-300 underline mt-2" target="_blank" rel="noopener noreferrer">{t('shaktipeethas.learn_more')}</a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ShaktiPeethasTemplate;
