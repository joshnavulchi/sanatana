"use client";
import { useEffect, useState } from 'react';
import { getLocaleObject, loadLocaleNamespace } from '../../../lib/i18n';
import { useLocale } from '../../context/locale-context';
import { parseList } from 'lib/parseList';
import Link from 'next/link';
import LazyImage from '../lazy-image/LazyImage';
import styles from './sanatanadharmam.module.scss';

export default function UnderstandingOfSanatana() {
  const { locale } = useLocale();

  const localeObj = getLocaleObject(locale) as any;
  const initialSections = (localeObj && localeObj.home && Array.isArray(localeObj.home.sections))
    ? localeObj.home.sections
    : [];

  const [sections, setSections] = useState<any[]>(initialSections);

  useEffect(() => {
    // If we already have sections from the runtime cache, use them.
    const obj = getLocaleObject(locale) as any;
    if (obj && obj.home && Array.isArray(obj.home.sections)) {
      setSections(obj.home.sections);
      return;
    }

    // Otherwise load the `home` namespace once for this locale and update state.
    let cancelled = false;
    loadLocaleNamespace(locale, 'home').then((ns: any) => {
      if (cancelled) return;
      if (ns && Array.isArray(ns.sections)) {
        setSections(ns.sections);
      } else if (ns && ns.home && Array.isArray(ns.home.sections)) {
        setSections(ns.home.sections);
      }
    }).catch(() => { });
    return () => { cancelled = true; };
  }, [locale]);

  return (
    <div className={`${styles.understanding} content-wrapper`}>
      {sections.map((section: any, index: number) => {
        return (<div key={section.id} className={`${styles.sections} text-center`}>
          <div className={`mx-auto max-w-5xl`}>
            <h3 className={`${!section?.nodecaration ? styles.borderbottom : ''}`}>{section.title}</h3>
            <p>{section.content}</p>
            {section?.src && <LazyImage src={section.src} alt={section.title} width={320} height={320} className="object-cover flex justify-center" />}
          </div>
          <div className={`mx-auto ${section?.items?.length === 4 ? 'max-w-4xl' : 'max-w-6xl'} cards flex gap-10 md:gap-6`}>
            {section?.items && section?.items.map((topic: any, index: number) => (
              <div key={index} className="card w-full md:w-1/4 lg:w-1/4 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="text-center">
                  {topic.src && <LazyImage src={topic.src} alt={topic.title} width={76} height={76} className="object-cover flex justify-center" />}
                  <p className={`h4`}>{topic.title}</p>
                  <p>{topic.description}</p>
                  <Link href={topic.href} title={topic.title} className="small">Read more...</Link>
                </div>
              </div>
            ))}
            {section?.points && section?.points.map((point: any, idx: number) => (
              <div key={idx} className={`card w-full md:w-1/4 lg:w-1/4 rounded-2xl shadow-sm hover:shadow-md transition`}>
                {section?.pointSrc && <LazyImage src={section?.pointSrc[idx]} width={76} height={76} alt={point} className="object-cover flex justify-center" />}
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>);
      })}
    </div>
  )
}