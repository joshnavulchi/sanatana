"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale, getLocaleObject } from 'lib/i18n';
import { useT } from '../hooks/useT';
import { parseSections, parseMaybeObject } from 'lib/parseContent';
import FaqAccordion from '@components/faqaccordion/faqaccordion';
 
export default function DonateClient() {
  const { locale, isLoading } = useLocale();
  const t = useT();
  
  // Initialize with current data to prevent empty renders on refresh
  const getInitialDonate = () => {
    try {
      const localeObj = getLocaleObject(locale) as any;
      if (!localeObj || Object.keys(localeObj).length === 0) {
        return { title: '', subtitle: '', purpose: {} as any, expenses: {} as any, donateOptions: {} as any, faq: {} as any };
      }
      
      const title = localeObj?.donate?.title || '';
      const subtitle = localeObj?.donate?.subtitle || '';
      const rawPurpose = parseMaybeObject(localeObj?.donate?.purpose);
      const rawExpenses = parseMaybeObject(localeObj?.donate?.expenses);
      const donateOptions = parseMaybeObject(localeObj?.donate?.donateOptions);
      const rawFaq = parseMaybeObject(localeObj?.donate?.faq);
      
      const purpose = (rawPurpose && typeof rawPurpose === 'object')
        ? { heading: rawPurpose.heading, points: parseSections(rawPurpose.points) }
        : { heading: '', points: parseSections(rawPurpose) };
      
      const expenses = (rawExpenses && typeof rawExpenses === 'object')
        ? { heading: rawExpenses.heading, table: Array.isArray(rawExpenses.table) ? rawExpenses.table : parseSections(rawExpenses.table) }
        : { heading: '', table: parseSections(rawExpenses) };
      
      const faq = (rawFaq && typeof rawFaq === 'object')
        ? { heading: rawFaq.heading, items: Array.isArray(rawFaq.items) ? rawFaq.items : parseSections(rawFaq.items) }
        : { heading: '', items: parseSections(rawFaq) };
      
      return { title, subtitle, purpose, expenses, donateOptions, faq };
    } catch (e) {
      return { title: '', subtitle: '', purpose: {} as any, expenses: {} as any, donateOptions: {} as any, faq: {} as any };
    }
  };
  
  const [donate, setDonate] = useState(getInitialDonate);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => {});
      } catch (e) {}

      if (!mounted) return;
      const title = t('donate.title') || '';
      const subtitle = t('donate.subtitle') || '';

      const rawPurpose = parseMaybeObject(t('donate.purpose'));
      const rawExpenses = parseMaybeObject(t('donate.expenses'));
      const donateOptions = parseMaybeObject(t('donate.donateOptions'));
      const rawFaq = parseMaybeObject(t('donate.faq'));

      const purpose = (rawPurpose && typeof rawPurpose === 'object')
        ? { heading: rawPurpose.heading, points: parseSections(rawPurpose.points) }
        : { heading: '', points: parseSections(rawPurpose) };

      const expenses = (rawExpenses && typeof rawExpenses === 'object')
        ? { heading: rawExpenses.heading, table: Array.isArray(rawExpenses.table) ? rawExpenses.table : parseSections(rawExpenses.table) }
        : { heading: '', table: parseSections(rawExpenses) };

      const faq = (rawFaq && typeof rawFaq === 'object')
        ? { heading: rawFaq.heading, items: Array.isArray(rawFaq.items) ? rawFaq.items : parseSections(rawFaq.items) }
        : { heading: '', items: parseSections(rawFaq) };

      setDonate({ title, subtitle, purpose, expenses, donateOptions, faq });
    })();
    return () => { mounted = false; };
  }, [locale]);

  if (isLoading && !donate.title) {
    return (
      <PageLayout metaKey="donate" title="" breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Donate' }]} className="">
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="donate" 
      title={donate.title}
      breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Donate' }]}
      className={`layout-sm`}
    >
      <p>{donate.subtitle}</p>
      {/* Purpose */}
      <section>
        <h3 className="h4">{donate.purpose?.heading}</h3>
        <ul className="list-disc">
          {(donate.purpose?.points || []).map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>
      {/* Expenses */}
      <section>
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
      </section>

      {/* Donate */}
      <section>
        <h5 className="h4">{donate.donateOptions?.oneTime?.heading}</h5>
        <p>{donate.donateOptions?.oneTime?.note}</p>

        {/* <div className="bg-amber-50 p-6 rounded">
          <p><strong>UPI:</strong> {donate.donateOptions?.bank?.upi}</p>
          <p><strong>Account Name:</strong> {donate.donateOptions?.bank?.accountName}</p>
          <p><strong>Account Number:</strong> {donate.donateOptions?.bank?.accountNumber}</p>
          <p><strong>IFSC:</strong> {donate.donateOptions?.bank?.ifsc}</p>
        </div> */}
      </section>
      {/* FAQ */}
      <div>
        <FaqAccordion items={(donate.faq?.items || [])} heading={donate.faq?.heading} />
      </div>
    </PageLayout>
  );
}
