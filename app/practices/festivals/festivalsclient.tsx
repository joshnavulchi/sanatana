"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import SimilarCategories from '@components/similar-categories/SimilarCategories';

export default function FestivalsClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('festivals_practices');

  const [data, setData] = useState({
    title: '',
    intro: '',
    items: [] as any[]
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const container = ns ?? {};
      const title = String(container?.title || 'Festivals');
      const intro = String(container?.intro || '');
      const items = Array.isArray(container?.items) ? container.items : [];
      setData({ title, intro, items });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="festivals_practices" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Festivals' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="festivals_practices"
      title={data.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-md"
    >
      <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/8 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600" />
            <span className="text-3xl animate-pulse">🛕</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600" />
          </div>
          <p className="text-md md:text-lg leading-relaxed mb-6">{data.intro}</p>
          {Array.isArray(data.items) && data.items.length > 0 && (
            <ul className="list-disc pl-6 text-amber-900 space-y-2">
              {data.items.map((item: any, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
