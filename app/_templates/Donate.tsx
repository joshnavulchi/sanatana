"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface DonateTemplateProps {
  data: {
    title: string;
    description: string;
    donationOptions: Array<{
      label: string;
      value: string;
      info?: string;
    }>;
    image?: string;
  };
}

const DonateTemplate: React.FC<DonateTemplateProps> = ({ data }) => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-gradient-radial from-yellow-100 via-white to-yellow-300 dark:from-yellow-900 dark:via-gray-900 dark:to-yellow-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-4xl mx-auto py-16 px-6">
        <div className="relative mb-10">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 70% 30%, #f59e42 0%, transparent 70%)'}} />
          <h1 className="relative z-10 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-orange-500 to-pink-400 dark:from-yellow-200 dark:via-orange-300 dark:to-pink-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          <p className="relative z-10 text-md text-yellow-700 dark:text-yellow-200 mb-6 font-medium tracking-wide">{data.description}</p>
        </div>
        {data.image && (
          <div className="flex justify-center mb-8">
            <img src={data.image} alt={data.title} className="w-48 h-48 object-cover rounded-full border-8 border-yellow-200 dark:border-yellow-700 shadow-2xl" />
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-2">
          {data.donationOptions.map((option, idx) => (
            <div key={idx} className="group bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-100 dark:from-gray-900 dark:via-yellow-950 dark:to-pink-900 rounded-2xl shadow-xl border-2 border-yellow-200 dark:border-yellow-700 p-6 flex flex-col items-center hover:scale-105 hover:shadow-yellow-400 dark:hover:shadow-yellow-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-tr from-pink-300 via-orange-300 to-yellow-400 dark:from-pink-900 dark:via-orange-900 dark:to-yellow-900 rounded-full blur-2xl opacity-20 pointer-events-none" />
              <span className="font-bold text-md text-yellow-800 dark:text-yellow-100 mb-2">{option.label}</span>
              <span className="text-md text-orange-700 dark:text-orange-200 mb-2">{option.value}</span>
              {option.info && <span className="text-base text-gray-500 dark:text-gray-400 mt-2 text-center">{option.info}</span>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default DonateTemplate;
