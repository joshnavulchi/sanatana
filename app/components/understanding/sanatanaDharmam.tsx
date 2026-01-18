'use client';
import { useT } from '../../hooks/useT';
import { JSX } from 'react';
import { parseList } from 'lib/parseList';
import Link from 'next/link';
import LazyImage from '../lazy-image/LazyImage';
import styles from './sanatanadharmam.module.scss';

export default function UnderstandingOfSanatana() {
  const t = useT();
  const sections = parseList(t("home.sections"));
  return (
    <div className={`${styles.understanding} content-wrapper`}>
      {sections.map((section: any, index: number) => {
        const level = Math.min(index + 2, 6);
        const Tag = `h${level}` as keyof JSX.IntrinsicElements
        return (<div key={section.id} className={`${styles.sections} text-center`}>
          <div className={`mx-auto max-w-5xl`}>
            <Tag className={`${!section?.nodecaration ? styles.borderbottom : ''}`}>{section.title}</Tag>
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