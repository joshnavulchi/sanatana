"use client";
import React, { useEffect, useState } from 'react';
import { useLocale } from '../../context/locale-context';
import useLocaleSection from '../../hooks/useLocaleSection';
import PageLayout from '@/app/components/common/PageLayout';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';
import Loader from '@/app/components/loader/loader';

export default function ShivaClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('stories_shiva');

  const [data, setData] = useState({ title: '', content: {} as any });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const title = String(ns?.title || 'Shiva');
      const content = ns || {};
      setData({ title, content });
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
      metaKey="stories_shiva"
      title={data.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-md"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <div className="prose max-w-none">
            {Object.entries(data.content).map(([k, v]) => (
              <section key={k} className="mb-6">
                <h3 className="text-2xl font-bold mb-3">{k.replace(/_/g, ' ').toUpperCase()}</h3>
                {renderValue(v, k)}
              </section>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/4">
          <div className="sticky top-24">
            <SimilarCategories currentCategory="stories" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
