"use client";
import { useLocale } from '../../context/locale-context';
import { t, getMeta } from '../../../lib/i18n';
import PageLayout from '@/app/components/common/PageLayout';

export default function DailyPrayersClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('stostrasmantras_dailyprayers', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : 'Daily Prayers',
      items: Array.isArray(k.items) ? k.items : []
    };
  })();

  return (
    <PageLayout
      metaKey="stostrasmantras_dailyprayers"
      title={page.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}
      className=""
    >
      <p>Placeholder for daily prayers and short mantras.</p>
    </PageLayout>
  );
}
