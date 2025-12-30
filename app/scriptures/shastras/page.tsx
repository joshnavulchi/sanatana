/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { t, detectLocale, getMeta } from '../../../lib/i18n';
import { createGenerateMetadata } from 'lib/pageUtils';
import Link from 'next/link';
export const generateMetadata = createGenerateMetadata('shastras');
export default async function ShastrasPage() {
  const locale = await detectLocale();
  const S = (k: string) => String(t(k, locale));
  const page: any = (() => {
    const k: any = getMeta('shastras', {}, locale) || {};
    return {
      title: typeof k.title === 'string' ? k.title : String(t('shastrasPage.title', locale) || ''),
      intro: typeof k.intro === 'string' ? k.intro : String(t('shastrasPage.intro', locale) || ''),
      sectionsTitle: typeof k.sectionsTitle === 'string' ? k.sectionsTitle : String(t('shastrasPage.sectionsTitle', locale) || ''),
      sections: (k.sections && typeof k.sections === 'object') ? k.sections : {
        dharma: String(t('shastrasPage.sections.dharma', locale)),
        artha: String(t('shastrasPage.sections.artha', locale)),
        vastu: String(t('shastrasPage.sections.vastu', locale)),
        natya: String(t('shastrasPage.sections.natya', locale))
      },
      influenceTitle: typeof k.influenceTitle === 'string' ? k.influenceTitle : String(t('shastrasPage.influenceTitle', locale) || ''),
      influenceText: typeof k.influenceText === 'string' ? k.influenceText : String(t('shastrasPage.influenceText', locale) || '')
    };
  })();
  return (
    <>
      <main className="content-wrapper md page-space-xl">
        <div>
          <h2>{page.title}</h2>
          <p>{page.intro}</p>
          <section>
            <h3>{page.sectionsTitle}</h3>
            <ul role="list" className="list-disc">
              <li><Link href="/shastras/dharma">{page.sections.dharma}</Link></li>
              <li><Link href="/shastras/artha">{page.sections.artha}</Link></li>
              <li><Link href="/shastras/vastu">{page.sections.vastu}</Link></li>
              <li><Link href="/shastras/natya">{page.sections.natya}</Link></li>
            </ul>
          </section>
          <section>
            <h4>{page.influenceTitle}</h4>
            <p>{page.influenceText}</p>
          </section>
        </div>
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */