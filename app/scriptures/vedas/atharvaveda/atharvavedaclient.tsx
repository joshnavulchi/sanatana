"use client";
import { useLocale } from '@app/context/locale-context';
import { t, getMeta } from '@lib/i18n';
import PageLayout from '@components/common/PageLayout';

export default function AtharvavedaClient() {
  const { locale } = useLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('scriptures_vedas_atharvaveda', undefined, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : 'Atharvaveda',
      summary: typeof k.summary === 'string' ? k.summary : '',
      contentTitle: typeof k.contentTitle === 'string' ? k.contentTitle : '',
      content: typeof k.content === 'string' ? k.content : ''
    };
  })();

  return (
    <PageLayout metaKey="scriptures_vedas_atharvaveda" title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title }]}>
      <p>{page.summary}</p>
      <section>
        <h2 className="text-2xl md:text-3xl">{page.contentTitle}</h2>
        <p>{page.content}</p>
      </section>
    </PageLayout>
  );
}
