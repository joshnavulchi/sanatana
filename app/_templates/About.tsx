"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface AboutTemplateProps {
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

const AboutTemplate: React.FC<AboutTemplateProps> = ({ data }) => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-gradient-radial from-green-100 via-white to-green-300 dark:from-green-900 dark:via-gray-900 dark:to-green-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-5xl mx-auto py-16 px-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 60% 40%, #22c55e 0%, transparent 70%)'}} />
          <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-lime-500 to-emerald-400 dark:from-green-200 dark:via-lime-300 dark:to-emerald-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.subtitle && (
            <p className="relative z-10 text-xl md:text-2xl text-green-700 dark:text-green-200 mb-8 font-medium tracking-wide">{data.subtitle}</p>
          )}
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data.sections.map((section, idx) => (
            <article
              key={idx}
              className="group rounded-3xl shadow-2xl bg-gradient-to-br from-white via-green-50 to-lime-100 dark:from-gray-900 dark:via-green-950 dark:to-lime-900 border-2 border-green-200 dark:border-green-700 p-8 flex flex-col items-center hover:scale-105 hover:shadow-green-400 dark:hover:shadow-green-900 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-emerald-300 via-lime-300 to-green-400 dark:from-emerald-900 dark:via-lime-900 dark:to-green-900 rounded-full blur-2xl opacity-30 pointer-events-none" />
              {section.image && (
                <img
                  src={section.image}
                  alt={section.heading}
                  className="w-24 h-24 object-cover rounded-full mb-6 border-4 border-green-200 dark:border-green-700 shadow-lg"
                />
              )}
              <h2 className="text-2xl font-extrabold text-green-800 dark:text-green-200 mb-3 text-center drop-shadow-md">{section.heading}</h2>
              <p className="text-green-700 dark:text-green-100 text-base text-center leading-relaxed">{section.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutTemplate;
