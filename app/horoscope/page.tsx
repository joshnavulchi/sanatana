
import HoroscopeClient from './HoroscopeClient';
import PageLayout from '@components/common/PageLayout';
import { t, getMeta } from '../../lib/i18n';

export const metadata = {
  title: 'Horoscope',
}; 

export default function Page() {
  const k: any = getMeta('horoscope', {}, undefined) || {};
  const title = typeof k.title === 'string' ? k.title : 'Horoscope Generator';
  const S = (label: string) => String(t(label));

  return (
    <>
      <PageLayout title={title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]}>
        <HoroscopeClient />
      </PageLayout>
    </>
  );
}
