"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface HomeTemplateProps {
  data: {
    title: string;
    subtitle?: string;
    sections: Array<{
      heading: string;
      content: string;
      image?: string;
    }>;
  };
}

const HomeTemplate: React.FC<HomeTemplateProps> = ({ data }) => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-gradient-radial from-indigo-100 via-white to-indigo-300 dark:from-indigo-900 dark:via-gray-900 dark:to-indigo-800 transition-colors duration-300 flex flex-col items-center justify-center">
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-40 pointer-events-none" style={{background: 'radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)'}} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-400 dark:from-indigo-200 dark:via-purple-300 dark:to-pink-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.subtitle && (
            <p className="relative z-10 text-md md:text-2xl text-indigo-700 dark:text-indigo-200 mb-8 font-medium tracking-wide">{data.subtitle}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-3 sm:grid-cols-2">
          {data.sections.map((section, idx) => (
            <article
              key={idx}
              className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-900 border-2 border-indigo-200 dark:border-indigo-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-indigo-400 dark:hover:shadow-indigo-900 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {section.image && (
                <img
                  src={section.image}
                  alt={section.heading}
                  className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-indigo-200 dark:border-indigo-700 shadow-lg"
                />
              )}
              <h2 className="text-2xl font-extrabold text-indigo-800 dark:text-indigo-200 mb-3 text-center drop-shadow-md">{section.heading}</h2>
              <p className="text-indigo-700 dark:text-indigo-100 text-base text-center leading-relaxed">{section.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomeTemplate;
