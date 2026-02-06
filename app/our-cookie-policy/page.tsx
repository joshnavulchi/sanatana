/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { useEffect, useState } from 'react';
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '../hooks/useLocaleSection';

export default function CookiePolicyPage() {
  const { locale } = useLocale();
  const policy = useLocaleSection('privacy_policy');
  const [data, setData] = useState<any>({});
  useEffect(() => {
    if (policy && typeof policy === 'object') setData(policy);
  }, [policy]);

  if (!data || !data.title) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-amber-700 mb-2">{data.title}</h1>
        <div className="text-sm text-gray-500">Last updated: {data.lastupdated}</div>
      </div>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-amber-800 mb-2">{data.intro?.title}</h2>
        <p className="text-gray-700 mb-2">{data.intro?.text}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">{data.informationwecollect?.title}</h2>
        <p className="mb-2">{data.informationwecollect?.lead}</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li><strong>{data.informationwecollect?.usagelabel}</strong> {data.informationwecollect?.usage}</li>
          <li><strong>{data.informationwecollect?.devicelabel}</strong> {data.informationwecollect?.device}</li>
          <li><strong>{data.informationwecollect?.cookieslabel}</strong> {data.informationwecollect?.cookies}</li>
          <li><strong>{data.informationwecollect?.contactlabel}</strong> {data.informationwecollect?.contact}</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">{data.howweuse?.title}</h2>
        <p className="mb-2">{data.howweuse?.lead}</p>
        <ul className="list-disc ml-6 text-gray-700">
          {data.howweuse?.items?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">{data.cookieslocalstorage?.title}</h2>
        <p className="text-gray-700">{data.cookieslocalstorage?.text}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">{data.thirdparty?.title}</h2>
        <p className="text-gray-700">{data.thirdparty?.text}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">{data.security?.title}</h2>
        <p className="text-gray-700">{data.security?.text}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">{data.rights?.title}</h2>
        <p className="mb-2">{data.rights?.lead}</p>
        <ul className="list-disc ml-6 text-gray-700">
          {data.rights?.items?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
        </ul>
        <p className="mt-2 text-gray-700">{data.rights?.contacttext}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">{data.children?.title}</h2>
        <p className="text-gray-700">{data.children?.text}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">{data.changes?.title}</h2>
        <p className="text-gray-700">{data.changes?.text}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">{data.contact?.title}</h2>
        <p className="mb-2">{data.contact?.lead}</p>
        <div className="mb-1"><strong>{data.contact?.emaillabel}</strong> <a href={`mailto:${data.contact?.email}`} className="text-blue-700 underline">{data.contact?.email}</a></div>
        <div className="mb-1"><strong>{data.contact?.websitelabel}</strong> <a href={data.contact?.website} className="text-blue-700 underline">{data.contact?.website}</a></div>
        <p className="mt-2 text-gray-700">{data.contact?.closing}</p>
      </section>
    </main>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */