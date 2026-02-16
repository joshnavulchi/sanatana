"use client";
import { useEffect, useState } from 'react';
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';
import Loader from '@/app/components/loader/loader';

export default function KrishnaClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('stories_krishna');

  const [data, setData] = useState({ title: '', intro: '', content: {} as any });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const title = String(ns?.title || 'Krishna');
      const intro = String(ns?.intro || '');
      const content = ns || {};
      setData({ title, intro, content });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !data.title) {
    return (
      <PageLayout
        metaKey="stories_krishna"
        title=""
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Krishna' }]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  const fmtLabel = (s: string) => s.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(^|\s)\w/g, c => c.toUpperCase());

  const renderValue = (value: any, key?: string) => {
    if (value == null) return null;
    if (typeof value === 'string') return <p className="mb-3">{value}</p>;

    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      if (value.every(v => typeof v === 'string')) {
        return (
          <ul className="list-disc ml-6 mb-4">
            {value.map((v, i) => <li key={i}>{v}</li>)}
          </ul>
        );
      }

      return (
        <div className="grid gap-4">
          {value.map((item, i) => (
            <div key={i} className="p-4 border rounded-md bg-white/60">
              {typeof item === 'object' ? Object.entries(item).map(([k, v]) => (
                <div key={k} className="mb-2">
                  <div className="font-semibold">{fmtLabel(k)}</div>
                  <div className="text-sm text-gray-700">{renderValue(v, k)}</div>
                </div>
              )) : <div>{String(item)}</div>}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <div className="space-y-3">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <div className="text-lg font-semibold mb-1">{fmtLabel(k)}</div>
              <div className="text-sm text-gray-700">{renderValue(v, k)}</div>
            </div>
          ))}
        </div>
      );
    }

    return <div>{String(value)}</div>;
  };

  return (
    <PageLayout
      metaKey="stories_krishna"
      title={data.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-md"
    >
      <div id="krishna-content">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 rounded-2xl border-l-4 border-emerald-500 shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500" />
                  <span className="text-3xl animate-pulse">📖</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500" />
                </div>
                {data.intro && <p className="text-lg md:text-xl leading-relaxed">{data.intro}</p>}
              </div>
            </div>
            <div className="prose max-w-none text-gray-900">
              {['biography', 'timeline', 'majordilemmas', 'cursesandconsequences'].map((k) => (
                data.content[k] && (
                  <section key={k} className="mb-8 p-6 bg-white/80 border border-emerald-100 rounded-xl shadow-sm">
                    <h3 className="text-2xl font-bold mb-3 text-emerald-700 tracking-wide">{k.replace(/_/g, ' ').toUpperCase()}</h3>
                    {renderValue(data.content[k], k)}
                  </section>
                )
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/4">
            <SimilarCategories />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
