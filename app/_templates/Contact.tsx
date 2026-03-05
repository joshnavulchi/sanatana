"use client";
import React from "react";
import { useLocale } from "@app/context/locale-context";

interface ContactTemplateProps {
  data: {
    title: string;
    description?: string;
    contacts: Array<{
      type: string;
      value: string;
      icon?: string;
    }>;
    form?: boolean;
  };
}

const ContactTemplate: React.FC<ContactTemplateProps> = ({ data }) => {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-gradient-radial from-blue-100 via-white to-blue-300 dark:from-blue-900 dark:via-gray-900 dark:to-blue-800 flex items-center justify-center transition-colors duration-300">
      <section className="w-full max-w-3xl mx-auto py-16 px-6">
        <div className="relative mb-10">
          <div className="absolute inset-0 blur-2xl opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 20%, #2563eb 0%, transparent 70%)' }} />
          <h1 className="relative z-10 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-500 to-teal-400 dark:from-blue-200 dark:via-cyan-300 dark:to-teal-200 drop-shadow-xl mb-4 tracking-tight">{data.title}</h1>
          {data.description && <p className="relative z-10 text-lg text-blue-700 dark:text-blue-200 mb-6 font-medium tracking-wide">{data.description}</p>}
        </div>
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          {data.contacts.map((contact, idx) => (
            <div key={idx} className="group bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100 dark:from-gray-900 dark:via-blue-950 dark:to-teal-900 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-700 p-6 flex items-center hover:scale-105 hover:shadow-blue-400 dark:hover:shadow-blue-900 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-tr from-teal-300 via-cyan-300 to-blue-400 dark:from-teal-900 dark:via-cyan-900 dark:to-blue-900 rounded-full blur-2xl opacity-20 pointer-events-none" />
              {contact.icon && <img src={contact.icon} alt={contact.type} className="w-10 h-10 mr-4 rounded-full border-2 border-blue-200 dark:border-blue-700 shadow" />}
              <span className="font-bold text-lg text-blue-800 dark:text-blue-100 mr-2">{contact.type}:</span>
              <span className="text-cyan-700 dark:text-cyan-200">{contact.value}</span>
            </div>
          ))}
        </div>
        {data.form && (
          <form className="bg-gradient-to-br from-white via-blue-50 to-cyan-100 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-900 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-700 p-8 space-y-6">
            <input type="text" placeholder={t('contact.name')} className="w-full p-3 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-gray-900 text-blue-900 dark:text-white focus:ring-2 focus:ring-blue-400" />
            <input type="email" placeholder={t('contact.email')} className="w-full p-3 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-gray-900 text-blue-900 dark:text-white focus:ring-2 focus:ring-blue-400" />
            <textarea placeholder={t('contact.message')} className="w-full p-3 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-gray-900 text-blue-900 dark:text-white focus:ring-2 focus:ring-blue-400" rows={4} />
            <button type="submit" className="w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition">{t('contact.send')}</button>
          </form>
        )}
      </section>
    </main>
  );
};

export default ContactTemplate;
