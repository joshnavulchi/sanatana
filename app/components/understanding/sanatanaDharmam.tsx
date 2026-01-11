'use client';
import { useT } from '../../hooks/useT';
import { JSX } from 'react';
import { parseList } from 'lib/parseList';
import Link from 'next/link';
import Image from 'next/image';
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
          <div className="mx-auto max-w-2xl">
            <Tag className={`${styles.borderbottom} title`}>{section.title}</Tag>
            <p>{section.content}</p>
          </div>
          <div className={`cards flex gap-10 md:gap-6`}>
            {section?.items && section?.items.map((topic: any, index: number) => (
              <Link key={index} href={topic.href} title={topic.title} className="card w-full md:w-1/4 lg:w-1/4 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="text-center">
                  {topic.src && <Image src={topic.src} alt={topic.title} width={101} height={101} className="mx-auto object-cover" />}
                  <p className={`font-semibold`}>{topic.title}</p>
                  <p>{topic.description}</p>
                </div>
              </Link>
            ))}
            {section?.points && section?.points.map((point: any, idx: number) => (
              <div key={idx} className={`card w-full md:w-1/4 lg:w-1/4 rounded-2xl shadow-sm hover:shadow-md transition`}>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>);
      })}
    </div>
  )
}