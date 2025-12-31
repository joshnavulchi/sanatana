import { t, getMeta } from '../../lib/i18n';
import PageLayout from '@components/common/PageLayout';
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
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: title }]}
        className="sm"
      >
        <HoroscopeClient />
      </PageLayout>
    </>
  );
}