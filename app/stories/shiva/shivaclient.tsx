"use client";
import { useEffect, useState } from 'react';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import PageLayout from '@components/common/PageLayout';
import SimilarCategories from '@components/similar-categories/SimilarCategories';
import Loader from '@components/loader';

export default function ShivaClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('stories_shiva');

  const [data, setData] = useState({ title: '', intro: '', content: {} as any });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const title = String(ns?.title || 'Shiva');
      const intro = String(ns?.intro || '');
      const content = ns || {};
      setData({ title, intro, content });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !data.title) {
    return (
      <PageLayout
        metaKey="stories_shiva"
        title=""
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Shiva' }]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  const fmtLabel = (s: string) => s.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(^|\s)\w/g, c => c.toUpperCase());

  const renderValue = (value: any, key?: string) => {
    if (value == null) return null;
    if (typeof value === 'string') return <div className="text-xl md:text-lg mb-3">{value}</div>;

    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      return (
        <div className="space-y-3">
          {value.map((v, i) => (
            <div key={i} className="text-xl md:text-lg">{renderValue(v)}</div>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <div className="space-y-3">
          {Object.values(value).map((v, i) => (
            <div key={i} className="text-xl md:text-lg">{renderValue(v)}</div>
          ))}
        </div>
      );
    }

    return <div className="text-xl md:text-lg">{String(value)}</div>;
  };

  return (
    <PageLayout
      metaKey="stories_shiva"
      title={<span className="font-bold text-3xl">{data.title}</span>}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-md"
    >
      <div id="shiva-content">
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
                {data.intro && <p className="text-lg leading-relaxed">{data.intro}</p>}
              </div>
            </div>
            <div className="prose max-w-none text-gray-900 py-3 md:py-12">
              {Object.entries(data.content)
                .filter(([k, v]) => k !== 'title' && k !== 'intro' && k !== 'meta' && k !== 'schema' && v)
                .map(([k, v], idx) => (
                  <section
                    key={k}
                    className="mb-8 p-6 border rounded-xl shadow-lg bg-gradient-to-br from-emerald-50 via-white to-emerald-100 border-emerald-100 relative overflow-hidden"
                  >
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-100/20 rounded-full blur-2xl" />
                    <div className="relative z-10">{renderValue(v)}</div>
                  </section>
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
