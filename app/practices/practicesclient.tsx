"use client";
import { useMemo } from "react";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';

export default function PracticesClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('practices');
  const data = useMemo(() => {
    const title = String(ns?.title || 'Practices');
    const intro = String(ns?.intro || 'Explore the main practices of Sanatana Dharma.');
    const subpages = [
      { label: 'Daily Puja', href: '/practices/dailypuja' },
      { label: 'Festivals', href: '/practices/festivals' },
      { label: 'Rituals', href: '/practices/rituals' },
      { label: 'Vastu', href: '/practices/vastu' },
    ];
    return { title, intro, subpages };
  }, [ns]);

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="practices" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Practices' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="practices"
      title={data.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-md"
    >
      <p className="mb-8 text-xl md:text-lg leading-relaxed">{data.intro}</p>
      <div className="mt-8">
        <h2 className="text-xl md:text-lg font-bold mb-2">Explore Sub Pages:</h2>
        <ul className="list-disc ml-6">
          {data.subpages.map((sp, idx) => (
            <li key={idx}><a href={sp.href} className="text-blue-600 hover:underline">{sp.label}</a></li>
          ))}
        </ul>
      </div>
    </PageLayout>
  );
}
