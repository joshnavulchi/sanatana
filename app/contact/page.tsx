/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale } from '../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import PageLayout from '@components/common/PageLayout';
import ContactForm from '../components/contact/ContactForm';
import Image from 'next/image';
import FaqAccordion from '@components/common/FaqAccordion';
export const generateMetadata = createGenerateMetadata('contact');

export default async function ContactPage() {
  const locale = await detectLocale();
  const S = (k: string) => String(t(k, locale));
  return (
    <>
      <PageLayout metaKey="contact" title={S('contact.title')} breadcrumbs={[{ labelKey: 'nav.home', href: '/' }, { label: 'Contact' }]} className="sm">
        <p>{S('contact.lead')}</p>
        <section className="flex flex-col md:flex-row items-start justify-start gap-5">
          <div className="w-full md:w-1/2">
            <h2>{S('contact.getInTouch')}</h2>
            <p>{S('contact.useForm')} <a href="mailto:vulchi.vijay@gmail.com">vulchi.vijay@gmail.com</a>.</p>
            <div>
              <div>
                <h3>{S('contact.mailingAddress')}</h3>
                <p>{S('contact.addressLine1')}<br />{S('contact.addressLine2')}<br />{S('contact.addressLine3')}</p>
              </div>
              <div>
                <h4>{S('contact.phone')}</h4>
                <p>+91-80991-81075</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 contact-form-wrapper bg-white shadow-md rounded-xl">
            <p>{S('contact.sendMessage')}</p>
            <ContactForm />
          </div>
        </section>
        <section>
          <p>{S('contact.location')}</p>
          <div className="bg-white p-4">
            <Image src="/images/map-location.png" alt="map location" width="1200" height="600" />
          </div>
        </section>
        {/* FAQs */}
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