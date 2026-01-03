/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../lib/i18n';
import { parseList } from 'lib/parseList';
import { createGenerateMetadata } from 'lib/pageUtils';
import PayPalButton from '../components/paypalbutton';
import PageLayout from '@components/common/PageLayout';
import Link from 'next/link';
import Image from 'next/image';
import FaqAccordion from '@components/common/FaqAccordion';
export const generateMetadata = createGenerateMetadata('donate');

import styles from './page.module.scss';

export default function Page() {
  const locale = detectLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('donate', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('donate.title', locale)),
      lead: k.lead || String(t('donate.lead', locale)),
      description: k.description || String(t('donate.description', locale)),
      expansestitle: k.expansesTitle || String(t('donate.expansestitle', locale)),
      tablename: k.table?.name || String(t('donate.table.name', locale)),
      tableexpanses: k.table?.expanses || String(t('donate.table.expanses', locale)),
      tableduration: k.table?.duration || String(t('donate.table.duration', locale)),
      tablereasons: k.table?.reasons || String(t('donate.table.reasons', locale)),
      expenses: Array.isArray(k.expenses) ? k.expenses : parseList(t('donate.expenses', locale)),
      onetime: k.onetime || String(t('donate.onetime', locale)),
      onetimelead: k.onetimelead || String(t('donate.onetimelead', locale)),
      upititle: k.upibank || String(t('donate.upibank', locale)),
      upilead: k.upilead || String(t('donate.upilead', locale)),
      upilabel: k.upilabel || String(t('donate.upilabel', locale)),
      upiid: k.upiid || String(t('donate.upiid', locale)),
      accountnamelabel: k.accountnamelabel || String(t('donate.accountnamelabel', locale)),
      accountname: k.accountname || String(t('donate.accountName', locale)),
      accountnumberlabel: k.accountnumberlabel || String(t('donate.accountnumberlabel', locale)),
      accountnumber: k.accountnumber || String(t('donate.accountnumber', locale)),
      ifsclabel: k.ifsclabel || String(t('donate.ifsclabel', locale)),
      ifsc: k.ifsc || String(t('donate.ifsc', locale)),
      recurring: k.recurring || String(t('donate.recurring', locale)),
      recurringlead: k.recurringlead || String(t('donate.recurringlead', locale)),
      becomemonthly: k.becomemonthly || String(t('donate.becomemonthly', locale))
    };
  })();
  return (
    <>
      <PageLayout
        metaKey="donate"
        title={page.title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Donate' }]}
        className={`${styles.donatePage} layout-sm`}
      >
        <p>{page.lead}</p>
        <p>{page.description}</p>
        <section className="donation-wrapper">
          <h2>{page.expansestitle}</h2>
          <div className={`${styles.card} shadow-md rounded-xl overflow-auto`}>
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="border p-2">{page.tablename}</th>
                  <th className="border p-2">{page.tableexpanses}</th>
                  <th className="border p-2">{page.tableduration}</th>
                  <th className="border p-2">{page.tablereasons}</th>
                </tr>
              </thead>
              <tbody>
                {page.expenses.length > 0 ? (
                  page.expenses.map((r: any, i: number) => (
                    <tr key={i}>
                      <td className="border p-2">{r.name}</td>
                      <td className="border p-2">{r.expanses}</td>
                      <td className="border p-2">{r.duration}</td>
                      <td className="border p-2">{r.provider}</td>
                    </tr>
                  ))
                ) : null}
              </tbody>
            </table>
          </div>
          <h3>{page.onetime}</h3>
          <div className={`${styles.card} shadow-md rounded-xl`}>
            <p>{page.onetimelead}</p>
            <PayPalButton link="https://www.paypal.com/ncp/payment/WYDY7465MG69" />
          </div>
          <h4>{page.upititle}</h4>
          <div className={`${styles.card} shadow-md rounded-xl`}>
            <div className="flex flex-col md:flex-row items-center justify-start gap-10">
              <ul role="list" className="list-disc">
                <li>{page.upilead}</li>
                <li><strong>{page.upilabel}</strong> {page.upiid}</li>
                <li><strong>{page.accountnamelabel}</strong> {page.accountname}</li>
                <li><strong>{page.accountnumberlabel}</strong> {page.accountnumber}</li>
                <li><strong>{page.ifsclabel}</strong> {page.ifsc}</li>
              </ul>
              <b>(Or)</b>
              <figure>
                <Image src="/images/UPI-qrcode.png" alt="UPI QR Code" width={200} height={200} />
              </figure>
            </div>
          </div>
          <div className={`${styles.card} shadow-md hidden`}>
            <p>{S('donate.recurring')}</p>
            <p>{S('donate.recurringlead')}</p>
            <Link href="#">
              {S('donate.becomemonthly')}
            </Link>
          </div>
          {/* FAQs */}
          {(() => {
            try {
              const faqItems = (t('donate.faq.items', locale) as any) || [];
              const faqHeading = String(t('donate.faq.heading', locale) || '');
              if (Array.isArray(faqItems) && faqItems.length > 0) {
                return <FaqAccordion items={faqItems} heading={faqHeading} />;
              }
            } catch (e) {
              /* ignore */
            }
            return null;
          })()}
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */