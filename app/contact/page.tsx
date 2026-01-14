/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
import ContactForm from '../components/contact/ContactForm';
import Image from 'next/image';
import FaqAccordion from '@components/common/FaqAccordion';
export const generateMetadata = createGenerateMetadata('contact');

import styles from './page.module.scss';

async function loadContactSections(locale: string) {
  try {
    // server-side load of locale JSON
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(`../../locales/${locale}/contact.json`);
    const obj = (mod && (mod.default || mod)) as any;
    const pageObj = obj?.contact ?? obj;
    return Array.isArray(pageObj?.sections) ? pageObj.sections : [];
  } catch (e) {
    return [];
  }
}

async function loadContactPage(locale: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(`../../locales/${locale}/contact.json`);
    const obj = (mod && (mod.default || mod)) as any;
    return obj?.contact ?? obj ?? {};
  } catch (e) {
    return {};
  }
}

export default async function ContactPage() {
  const locale = await detectLocale();
  const S = (k: string) => String(t(k, locale));
  const sections = await loadContactSections(locale);
  const pageObj = await loadContactPage(locale);

  const renderSection = (sec: any, idx: number) => {
    const key = `${sec.id || sec.type}-${idx}`;
    switch (sec.type) {
      case 'text':
        return (
          <section key={key} className="mb-6">
            {sec.title ? <h2>{sec.title}</h2> : null}
            {sec.content ? <p>{sec.content}</p> : null}
          </section>
        );
      case 'grid':
        return (
          <section key={key} className="mb-6">
            {sec.title ? <h3>{sec.title}</h3> : null}
            <div className="flex gap-4">
              {Array.isArray(sec.columns) ? sec.columns.map((col: any, i: number) => (
                <div key={i} className="w-full md:w-1/3 bg-white shadow-md/14 p-4 border rounded">
                  {col.title ? <h4>{col.title}</h4> : null}
                  {col.content ? <p>{col.content}</p> : null}
                </div>
              )) : null}
            </div>
          </section>
        );
      case 'form':
        return (
          <section key={key} className="mb-6">
            {sec.title ? <h3>{sec.title}</h3> : null}
            <div className={`${styles.contactform} contact-form-wrapper shadow-md rounded-xl`}>
              {Array.isArray(sec.fields) && <ContactForm fields={sec.fields} submitButton={sec.submitButton} />}
            </div>
          </section>
        );
      case 'embed':
        return (
          <section key={key} className="mb-6">
            {sec.title ? <h3>{sec.title}</h3> : null}
            {sec.content ? <div dangerouslySetInnerHTML={{ __html: sec.content }} /> : null}
          </section>
        );
      default:
        return (
          <section key={key} className="mb-6">
            <pre>{JSON.stringify(sec, null, 2)}</pre>
          </section>
        );
    }
  };

  return (
    <>
      <PageLayout
        metaKey="contact"
        title={S('contact.title')}
        breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Contact' }]}
        className="layout-sm"
      >
        <p>{S('contact.subtitle')}</p>
        {sections && sections.length > 0 ? sections.map(renderSection) : (
          <>
            <section className="flex flex-col md:flex-row items-start justify-start gap-5">
              <div className="w-full md:w-1/2">
                <h2>{S('contact.getintouch')}</h2>
                <p>{S('contact.useform')} <a href="mailto:vulchi.vijay@gmail.com">vulchi.vijay@gmail.com</a>.</p>
                <div>
                  <div>
                    <h3>{S('contact.mailingaddress')}</h3>
                    <p>{S('contact.addressline1')}<br />{S('contact.addressline2')}<br />{S('contact.addressline3')}</p>
                  </div>
                  <div>
                    <h4>{S('contact.phone')}</h4>
                    <p>+91-80991-81075</p>
                  </div>
                </div>
              </div>
              <div className={`${styles.contactform} w-full md:w-1/2 contact-form-wrapper shadow-md rounded-xl`}>
                <p>{S('contact.sendmessage')}</p>
                <ContactForm submitButton={pageObj?.submitButton ?? null} />
              </div>
            </section>
            <section>
              <p>{S('contact.location')}</p>
              <div className="bg-white p-4">
                <Image src="/images/map-location.png" alt="map location" width="1200" height="600" />
              </div>
            </section>
          </>
        )}

        {(() => {
          try {
            const faqItems = (t('contact.faq.items', locale) as any) || [];
            const faqHeading = String(t('contact.faq.heading', locale) || '');
            if (Array.isArray(faqItems) && faqItems.length > 0) {
              return <FaqAccordion items={faqItems} heading={faqHeading} />;
            }
          } catch (e) {
            /* ignore */
          }
          return null;
        })()}
      </PageLayout>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */