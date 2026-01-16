"use client";
import React, { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale } from 'lib/i18n';
import { useT } from '../hooks/useT';
import { parseList } from 'lib/parseList';
import FaqAccordion from '@/app/components/faqaccordion/faqaccordion';

import styles from './page.module.scss';

function parseSections(raw: any) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // not JSON, fall back to newline parsing
      return parseList(raw);
    }
  }
  return [];
}

function parseMaybeObject(raw: any) {
  if (!raw) return raw;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return raw;
    }
  }
  return raw;
}

export default function DonateClient() {
  const { locale } = useLocale();
  const t = useT();
  const [donate, setDonate] = useState({ title: '', subtitle: '', purpose: {} as any, expenses: {} as any, donateOptions: {} as any, faq: {} as any });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => {});
      } catch (e) {}

      if (!mounted) return;
      const title = String(t('donate.title') || '');
      const subtitle = String(t('donate.subtitle') || ''); 
      let purpose: any = parseMaybeObject(t('donate.purpose'));
      let expenses: any = parseMaybeObject(t('donate.expenses'));
      let donateOptions: any = parseMaybeObject(t('donate.donate_options'));
      let faq: any = parseMaybeObject(t('donate.faq'));
      console.log(title);
      // Normalize nested list/object fields that may be returned as JSON strings
      if (purpose && typeof purpose === 'object') {
        purpose.points = parseSections((purpose as any).points);
      } else {
        // if purpose is plain string, convert to points array
        purpose = { heading: '', points: parseSections(purpose) };
      }

      if (expenses && typeof expenses === 'object') {
        expenses.table = Array.isArray(expenses.table) ? expenses.table : parseSections(expenses.table);
      } else {
        expenses = { heading: '', table: parseSections(expenses) };
      }

      if (faq && typeof faq === 'object') {
        faq.items = Array.isArray(faq.items) ? faq.items : parseSections(faq.items);
      } else {
        faq = { heading: '', items: parseSections(faq) };
      }
      setDonate({ title, subtitle, purpose, expenses, donateOptions, faq });
    })();
    return () => { mounted = false; };
  }, [locale]);

  return (
    <PageLayout
      metaKey="donate" 
      title={donate.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Donate' }]}
      className={`${styles.donatePage} layout-sm`}
    >
      <p>{donate.subtitle}</p>
      {/* Purpose */}
      <section>
        <h3>{donate.purpose?.heading}</h3>
        <ul className="list-disc">
          {(donate.purpose?.points || []).map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>
      {/* Expenses */}
      <section>
        <div>
          <h4>{donate.expenses?.heading}</h4>
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
              {(donate.expenses?.table || []).map((row: any, i: number) => (
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
        <h5>{donate.donateOptions?.oneTime?.heading}</h5>
        <p>{donate.donateOptions?.oneTime?.note}</p>

        <div className="bg-amber-50 p-6 rounded">
          <p><strong>UPI:</strong> {donate.donateOptions?.bank?.upi}</p>
          <p><strong>Account Name:</strong> {donate.donateOptions?.bank?.accountName}</p>
          <p><strong>Account Number:</strong> {donate.donateOptions?.bank?.accountNumber}</p>
          <p><strong>IFSC:</strong> {donate.donateOptions?.bank?.ifsc}</p>
        </div>
      </section>
      {/* FAQ */}
      <div>
        <FaqAccordion items={(donate.faq?.items || [])} heading={donate.faq?.heading} />
      </div>
    </PageLayout>
  );
}
