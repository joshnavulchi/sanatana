import PageLayout from '@/app/components/common/PageLayout';
import { t, getMeta } from '../../lib/i18n';
import HoroscopeClient from './HoroscopeClient';

export const metadata = {
  title: 'Horoscope',
};

export default function Page() {
  const k: any = getMeta('horoscope', {}, undefined) || {};
  const title = typeof k.title === 'string' ? k.title : 'Horoscope Generator';
  const S = (label: string) => String(t(label));
  return (
    <>
      <PageLayout
        metaKey="horoscope"
        title={title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: title }]}
        className="layout-sm"
      >
        <HoroscopeClient />
      </PageLayout>
    </>
  );
}