/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../lib/i18n';
import { parseList } from 'lib/parseList';
import { createcreateGenerateMetadata } from 'lib/pageUtils';
import PayPalButton from '../components/paypalbutton';
import PageLayout from '@components/common/PageLayout';
import Link from 'next/link';
import Image from 'next/image';
export const generateMetadata = createcreateGenerateMetadata('donate');
export default function DonatePage() {
  const locale = detectLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('donate', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('donatePage.title', locale)),
      lead: k.lead || String(t('donatePage.lead', locale)),
      expansesTitle: k.expansesTitle || String(t('donatePage.expansesTitle', locale)),
      tableName: k.table?.name || String(t('donatePage.table.name', locale)),
      tableExpanses: k.table?.expanses || String(t('donatePage.table.expanses', locale)),
      tableDuration: k.table?.duration || String(t('donatePage.table.duration', locale)),
      tableReasons: k.table?.reasons || String(t('donatePage.table.reasons', locale)),
      expenses: Array.isArray(k.expenses) ? k.expenses : parseList(t('donatePage.expenses', locale)),
      oneTime: k.oneTime || String(t('donatePage.oneTime', locale)),
      oneTimeLead: k.oneTimeLead || String(t('donatePage.oneTimeLead', locale)),
      upiTitle: k.upiBank || String(t('donatePage.upiBank', locale)),
      upiLead: k.upiLead || String(t('donatePage.upiLead', locale)),
      upiLabel: k.upiLabel || String(t('donatePage.upiLabel', locale)),
      upiId: k.upiId || String(t('donatePage.upiId', locale)),
      accountNameLabel: k.accountNameLabel || String(t('donatePage.accountNameLabel', locale)),
      accountName: k.accountName || String(t('donatePage.accountName', locale)),
      accountNumberLabel: k.accountNumberLabel || String(t('donatePage.accountNumberLabel', locale)),
      accountNumber: k.accountNumber || String(t('donatePage.accountNumber', locale)),
      ifscLabel: k.ifscLabel || String(t('donatePage.ifscLabel', locale)),
      ifsc: k.ifsc || String(t('donatePage.ifsc', locale)),
      recurring: k.recurring || String(t('donatePage.recurring', locale)),
      recurringLead: k.recurringLead || String(t('donatePage.recurringLead', locale)),
      becomeMonthly: k.becomeMonthly || String(t('donatePage.becomeMonthly', locale))
    };
  })();
  return (
    <>
      <PageLayout title={page.title} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: (typeof page.title !== 'undefined' ? page.title : '') }]} locale={(typeof locale !== 'undefined' ? locale : undefined)}>
        <h2>{page.title}</h2>
        <p>{page.lead}</p>
        <section className="donation-wrapper">
          <h3>{page.expansesTitle}</h3>
          <div className="bg-white shadow-md rounded-xl overflow-auto">
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="border p-2">{page.tableName}</th>
                  <th className="border p-2">{page.tableExpanses}</th>
                  <th className="border p-2">{page.tableDuration}</th>
                  <th className="border p-2">{page.tableReasons}</th>
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
          <h4>{page.oneTime}</h4>
          <div className="bg-white shadow-md rounded-xl">
            <p>{page.oneTimeLead}</p>
            <PayPalButton link="https://www.paypal.com/ncp/payment/WYDY7465MG69" />
          </div>
          <h5>{page.upiTitle}</h5>
          <div className="bg-white shadow-md rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-start gap-10">
              <ul role="list" className="list-disc">
                <li>{page.upiLead}</li>
                <li><strong>{page.upiLabel}</strong> {page.upiId}</li>
                <li><strong>{page.accountNameLabel}</strong> {page.accountName}</li>
                <li><strong>{page.accountNumberLabel}</strong> {page.accountNumber}</li>
                <li><strong>{page.ifscLabel}</strong> {page.ifsc}</li>
              </ul>
              <b>(Or)</b>
              <figure>
                <Image src="/images/UPI-qrcode.png" alt="UPI QR Code" width={200} height={200} />
              </figure>
            </div>
          </div>
          <div className="bg-white shadow-md hidden">
            <p>{S('donatePage.recurring')}</p>
            <p>{S('donatePage.recurringLead')}</p>
            <Link href="#">
              {S('donatePage.becomeMonthly')}
            </Link>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */