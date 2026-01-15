/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../lib/i18n';
import { parseList } from 'lib/parseList';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import PayPalButton from '../components/paypalbutton';
import PageLayout from '@components/common/PageLayout';
import Link from 'next/link';
import LazyImage from '@components/lazy-image/LazyImage';
import FaqAccordion from '@components/common/FaqAccordion';
export const generateMetadata = createGenerateMetadata('donate');

import styles from './page.module.scss';

export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  const S = (k: string) => String(t(k, locale));

  const d: any = (() => ({
    title: String(t('donate.title', locale) || ''),
    subtitle: String(t('donate.subtitle', locale) || ''),
    purpose: {
      heading: String(t('donate.purpose.heading', locale) || ''),
      points: parseList(t('donate.purpose.points', locale)),
    },
    expenses: {
      heading: String(t('donate.expenses.heading', locale) || ''),
      table: (t('donate.expenses.table', locale) as any) || [],
    },
    donateOptions: {
      oneTime: {
        heading: String(t('donate.donateOptions.oneTime.heading', locale) || ''),
        note: String(t('donate.donateOptions.oneTime.note', locale) || ''),
      },
      bank: {
        upi: String(t('donate.donateOptions.bank.upi', locale) || ''),
        accountName: String(t('donate.donateOptions.bank.accountName', locale) || ''),
        accountNumber: String(t('donate.donateOptions.bank.accountNumber', locale) || ''),
        ifsc: String(t('donate.donateOptions.bank.ifsc', locale) || ''),
      }
    },
    faq: {
      heading: String(t('donate.faq.heading', locale) || ''),
      items: parseList(t('donate.faq.items', locale)),
    }
  }))();

  return (
    <>
      <PageLayout
        metaKey="donate"
        title={d.title}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Donate' }]}
        className={`${styles.donatePage} layout-sm`}
      >
        <p>{d.subtitle}</p>
        {/* Purpose */}
        <section>
          <h3>{d.purpose?.heading}</h3>
          <ul className="list-disc">
            {(d.purpose?.points || []).map((p: string, i: number) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        {/* Expenses */}
        <section>
          <div>
            <h4>{d.expenses?.heading}</h4>
            <table className="w-full border">
              <thead className="bg-amber-50">
                <tr>
                  <th className="p-3 text-left">Item</th>
                  <th className="p-3 text-left">Cost</th>
                  <th className="p-3 text-left">Cycle</th>
                  <th className="p-3 text-left">Provider</th>
                </tr>
              </thead>
              <tbody>
                {(d.expenses?.table || []).map((row: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{row.name}</td>
                    <td className="p-3">{row.cost}</td>
                    <td className="p-3">{row.cycle}</td>
                    <td className="p-3">{row.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Donate */}
        <section>
          <h5>{d.donateOptions?.oneTime?.heading}</h5>
          <p>{d.donateOptions?.oneTime?.note}</p>

          <div className="bg-amber-50 p-6 rounded">
            <p><strong>UPI:</strong> {d.donateOptions?.bank?.upi}</p>
            <p><strong>Account Name:</strong> {d.donateOptions?.bank?.accountName}</p>
            <p><strong>Account Number:</strong> {d.donateOptions?.bank?.accountNumber}</p>
            <p><strong>IFSC:</strong> {d.donateOptions?.bank?.ifsc}</p>
          </div>
        </section>

        {/* FAQ */}
        <div>
          <FaqAccordion items={(d.faq?.items || [])} heading={d.faq?.heading} />
        </div>
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */