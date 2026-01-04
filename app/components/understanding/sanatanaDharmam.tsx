'use client';
import { useT } from '../../hooks/useT';
import { parseList } from 'lib/parseList';
import styles from './sanatanadharmam.module.scss';
import ElectricalBorder from '../electrical-border/electrical';

export default function UnderstandingOfSanatana() {
  const t = useT();
  const sections = parseList(t("home.sections"));

  return (
    <div className={`${styles.understanding} content-wrapper text-center`}>
      {sections.map((section) => (
        <div key={section.id} className={`${styles.sections}`}>
          <ElectricalBorder title={section.title} />
          <p className={`subtitle`}>{section.content}</p>
          <div className={`cards flex gap-10 md:gap-6`}>
            {section?.items && section?.items.map((topic: any, index: number) => (
              <div key={index} className={`card w-full md:w-1/4 lg:w-1/4 rounded-2xl shadow-sm hover:shadow-md transition`}>
                <p className={`${styles.cardtitle} font-semibold`}>{topic.title}</p>
                <p className={`${styles.carddescrip}`}>{topic.description}</p>
              </div>
            ))}
            {section?.points && section?.points.map((point: any, idx: number) => (
              <div key={idx} className={`card w-full md:w-1/4 lg:w-1/4 rounded-2xl shadow-sm hover:shadow-md transition`}>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}