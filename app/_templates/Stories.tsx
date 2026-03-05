"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface StoriesTemplateProps {
  data: {
    title: string;
    description?: string;
    stories: Array<{
      name: string;
      summary: string;
      image?: string;
      link?: string;
    }>;
  };
}

const StoriesTemplate: React.FC<StoriesTemplateProps> = ({ data }) => {
  const { t } = useLocale();
  return (
    <main className="min-h-screen bg-gradient-radial from-fuchsia-100 via-white to-fuchsia-300 dark:from-fuchsia-900 dark:via-gray-900 dark:to-fuchsia-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 40%, #d946ef 0%, transparent 70%)' }} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-700 via-pink-500 to-indigo-400 dark:from-fuchsia-200 dark:via-pink-300 dark:to-indigo-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.description && (
            <p className="relative z-10 text-md md:text-2xl text-fuchsia-700 dark:text-fuchsia-200 mb-8 font-medium tracking-wide">{data.description}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.stories.map((story, idx) => (
            <article key={idx} className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-fuchsia-50 to-pink-100 dark:from-gray-900 dark:via-fuchsia-950 dark:to-pink-900 border-2 border-fuchsia-200 dark:border-fuchsia-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-fuchsia-400 dark:hover:shadow-fuchsia-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-pink-300 via-fuchsia-300 to-indigo-400 dark:from-pink-900 dark:via-fuchsia-900 dark:to-indigo-900 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {story.image && (
                <img src={story.image} alt={story.name} className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-fuchsia-200 dark:border-fuchsia-700 shadow-lg" />
              )}
              <h2 className="text-2xl font-extrabold text-fuchsia-800 dark:text-fuchsia-200 mb-3 text-center drop-shadow-md">{story.name}</h2>
              <p className="text-fuchsia-700 dark:text-fuchsia-100 text-base text-center leading-relaxed mb-2">{story.summary}</p>
              {story.link && (
                <a href={story.link} className="text-fuchsia-600 dark:text-fuchsia-300 underline mt-2" target="_blank" rel="noopener noreferrer">{t('stories.read_more')}</a>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default StoriesTemplate;
