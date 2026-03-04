"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface KidsZoneTemplateProps {
  data: {
    title: string;
    description?: string;
    activities: Array<{
      name: string;
      summary: string;
      image?: string;
      link?: string;
    }>;
  };
}

const KidsZoneTemplate: React.FC<KidsZoneTemplateProps> = ({ data }) => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-gradient-radial from-orange-100 via-white to-yellow-300 dark:from-orange-900 dark:via-gray-900 dark:to-yellow-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 60% 40%, #fbbf24 0%, transparent 70%)'}} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-700 via-yellow-500 to-pink-400 dark:from-orange-200 dark:via-yellow-300 dark:to-pink-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.description && (
            <p className="relative z-10 text-xl md:text-2xl text-orange-700 dark:text-orange-200 mb-8 font-medium tracking-wide">{data.description}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.activities.map((activity, idx) => (
            <article key={idx} className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-orange-950 dark:to-yellow-900 border-2 border-orange-200 dark:border-orange-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-orange-400 dark:hover:shadow-orange-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-pink-300 via-yellow-300 to-orange-400 dark:from-pink-900 dark:via-yellow-900 dark:to-orange-900 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {activity.image && (
                <img src={activity.image} alt={activity.name} className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-orange-200 dark:border-orange-700 shadow-lg" />
              )}
              <h2 className="text-2xl font-extrabold text-orange-800 dark:text-orange-200 mb-3 text-center drop-shadow-md">{activity.name}</h2>
              <p className="text-orange-700 dark:text-orange-100 text-base text-center leading-relaxed mb-2">{activity.summary}</p>
              {activity.link && (
                <a href={activity.link} className="text-orange-600 dark:text-orange-300 underline mt-2" target="_blank" rel="noopener noreferrer">{t('kidszone.learn_more')}</a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default KidsZoneTemplate;
