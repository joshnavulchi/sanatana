'use client';

import { useT } from '../../hooks/useT';
import { parseList } from 'lib/parseList';
import Link from 'next/link';
import styles from './ourfourcoreyugas.module.scss';

export default function OurFourCoreYugas() {
  const t = useT();
  const yugas = parseList(t("home.ourfourcoreyugas"));
  return (
    <section className={`${styles.ourFourCoreYugas}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <p className={`title`}>The Four Yugas of Sanātana Dharma</p>
          <p className={`subtitle`}>Cosmic ages describing the gradual transformation of dharma and consciousness through time.</p>
        </div>
        {/* Yuga Cards */}
        <div className={`${styles.cards} flex gap-10 md:gap-6`}>
          {yugas.map(yuga => (
            <div
              key={yuga.name}
              className={`${styles.card} w-full md:w-1/4 lg:w-1/4 rounded-2xl shadow-sm hover:shadow-md transition`}
            >
              <p className={`${styles.cardtitle} font-semibold`}>{yuga.name}</p>
              <Link href="/cosmictime" title={yuga.age}><p className={styles.cardage}>{yuga.age}</p></Link>
              {/* Duration */}
              <div className={styles.details}>
                <p className="description tracking-wide">
                  <span className="uppercase font-semibold">Duration : </span><span>{yuga.duration} human years</span>
                </p>
              </div>
              {/* Description */}
              {/* <ul className={`${styles.list} list-disk`}>
                {yuga.description.map((point: any, index: number) => (
                  <li key={index} className="description">{point}.</li>
                ))}
              </ul> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}