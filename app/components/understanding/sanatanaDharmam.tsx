'use client';
import { useT } from '../../hooks/useT';
import { JSX } from 'react';
import { parseList } from 'lib/parseList';
import Link from 'next/link';
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
          <Tag className={`${styles.borderbottom} title`}>{section.title}</Tag>
          <p className={`description text-left indent-16`}>{section.content}</p>
          <p className={`description text-left indent-16`}>{section.description}</p>
          <div className={`cards flex gap-10 md:gap-6`}>
            {section?.items && section?.items.map((topic: any, index: number) => (
              <Link key={index} href={topic.href} title={topic.title} className="card w-full md:w-1/4 lg:w-1/4 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className={``}>
                  <p className={`font-semibold`}>{topic.title}</p>
                  <p className={`description text-left`}>{topic.description}</p>
                </div>
              </Link>
            ))}
            {section?.points && section?.points.map((point: any, idx: number) => (
              <div key={idx} className={`card w-full md:w-1/4 lg:w-1/4 rounded-2xl shadow-sm hover:shadow-md transition`}>
                <p className="subtitle font-semibold! mb-0!">{point}</p>
              </div>
            ))}
          </div>
        </div>);
      })}
    </div>
  )
}