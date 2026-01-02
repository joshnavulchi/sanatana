'use client';

import { useT } from '../../hooks/useT';
import { parseList } from 'lib/parseList';

import styles from './ourfourcoreyugas.module.scss';

export default function OurFourCoreYugas() {
  const t = useT();
  const yugas = parseList(t("home.ourFourCoreYugas"));

  return (
    <section className={`${styles.ourFourCoreYugas}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-4xl">
            The Four Yugas of Sanātana Dharma
          </p>
          <p className="max-w-2xl mx-auto">
            Cosmic ages describing the gradual transformation of dharma
            and consciousness through time.
          </p>
        </div>
        {/* Yuga Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {yugas.map(yuga => (
            <div
              key={yuga.name}
              className="card rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <p className="text-xl font-semibold">
                {yuga.name}
              </p>
              <p className="text-sm text-gray-600">
                {yuga.age}
              </p>

              {/* Duration */}
              <div className="">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Duration
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {yuga.duration}
                </p>
                <p className="text-xs text-gray-500">
                  human years
                </p>
              </div>

              {/* Description */}
              {/* <ul className="space-y-2 text-sm text-gray-700">
                {yuga.description.map((point: any, index: number) => (
                  <li key={index} className="flex gap-2">
                    <span className="rounded-full bg-gray-700"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}