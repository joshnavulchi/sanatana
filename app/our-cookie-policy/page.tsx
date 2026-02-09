/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';
import { useLocale } from '@/app/context/locale-context';
import useLocaleSection from '../hooks/useLocaleSection';

export default function CookiePolicyPage() {
  const { locale } = useLocale();
  const data = useLocaleSection('privacy_policy');

  if (!data || !data.title) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-amber-700 mb-2">{data.title}</h2>
        <div className="text-sm text-gray-500">Last updated: {data.lastupdated}</div>
      </div>
      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-amber-800 mb-2">{data.intro?.title}</h3>
        <p className=" mb-2">{data.intro?.text}</p>
      </section>
      <section className="mb-8">
        <h4 className="text-xl font-semibold text-amber-800 mb-2">{data.informationwecollect?.title}</h4>
        <p className="mb-2">{data.informationwecollect?.lead}</p>
        <ul className="list-disc ml-6 ">
          <li><strong>{data.informationwecollect?.usagelabel}</strong> {data.informationwecollect?.usage}</li>
          <li><strong>{data.informationwecollect?.devicelabel}</strong> {data.informationwecollect?.device}</li>
          <li><strong>{data.informationwecollect?.cookieslabel}</strong> {data.informationwecollect?.cookies}</li>
          <li><strong>{data.informationwecollect?.contactlabel}</strong> {data.informationwecollect?.contact}</li>
        </ul>
      </section>
      <section className="mb-8">
        <h5 className="text-xl font-semibold text-amber-800 mb-2">{data.howweuse?.title}</h5>
        <p className="mb-2">{data.howweuse?.lead}</p>
        <ul className="list-disc ml-6 ">
          {data.howweuse?.items?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
        </ul>
      </section>
      <section className="mb-8">
        <h6 className="text-xl font-semibold text-amber-800 mb-2">{data.cookieslocalstorage?.title}</h6>
        <p className="">{data.cookieslocalstorage?.text}</p>
      </section>
      <section className="mb-8">
        <h6 className="text-xl font-semibold text-amber-800 mb-2">{data.thirdparty?.title}</h6>
        <p className="">{data.thirdparty?.text}</p>
      </section>
      <section className="mb-8">
        <h6 className="text-xl font-semibold text-amber-800 mb-2">{data.security?.title}</h6>
        <p className="">{data.security?.text}</p>
      </section>
      <section className="mb-8">
        <h6 className="text-xl font-semibold text-amber-800 mb-2">{data.rights?.title}</h6>
        <p className="mb-2">{data.rights?.lead}</p>
        <ul className="list-disc ml-6 ">
          {data.rights?.items?.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
        </ul>
        <p className="mt-2 ">{data.rights?.contacttext}</p>
      </section>
      <section className="mb-8">
        <h6 className="text-xl font-semibold text-amber-800 mb-2">{data.children?.title}</h6>
        <p className="">{data.children?.text}</p>
      </section>
      <section className="mb-8">
        <h6 className="text-xl font-semibold text-amber-800 mb-2">{data.changes?.title}</h6>
        <p className="">{data.changes?.text}</p>
      </section>
      <section className="mb-8">
        <h6 className="text-xl font-semibold text-amber-800 mb-2">{data.contact?.title}</h6>
        <p className="mb-2">{data.contact?.lead}</p>
        <div className="mb-1"><strong>{data.contact?.emaillabel}</strong> <a href={`mailto:${data.contact?.email}`} className="text-blue-700 underline">{data.contact?.email}</a></div>
        <div className="mb-1"><strong>{data.contact?.websitelabel}</strong> <a href={data.contact?.website} className="text-blue-700 underline">{data.contact?.website}</a></div>
        <p className="mt-2 ">{data.contact?.closing}</p>
      </section>
    </main>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */