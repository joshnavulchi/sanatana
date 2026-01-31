"use client"
import useLocaleSection from '../../hooks/useLocaleSection';
import Link from 'next/link';
import WorldMapAnimated from '../worldmap/wordmap';

import styles from './gitsupport.module.scss';

export default function GitSupport({ locale }: { locale?: string }) {
  const loc = useLocaleSection('home');
  return (
    <section className={`gradient-background map-wrapper md:min-h-screen relative z-0 overflow-hidden`}>
      <WorldMapAnimated
        stroke="#ffffff"
        fill="#000000"
        fillOpacity={0.25}
        borderWidth={0.7}
        loopSpeed={6}       // slower, calmer
        stagger={16}
        fillPulse={true}
        pauseOnHover={true}
        scale={0.19}
        showGraticule={false}
      />
      <div className={`${styles.gitsupport} md:content-wrapper md:absolute md:top-1/2 md:left-20 md:-translate-y-1/2 md:z-1`}>
        <p className={`h3 font-light!`}>{loc?.cta?.title || 'Contribute'}</p>
        <p>{loc?.cta?.subtitle || ''}</p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="https://github.com/vulchivijay/first-contributes" target="_blank" className={`bg-white/65! text-black! btn btn-outline no-underline`}>{loc?.cta?.contribute || 'Contribute'}</Link>
          <Link href="https://github.com/vulchivijay/first-contributes" target="_blank" className={`bg-white/65! text-black! btn btn-outline no-underline`}>{loc?.cta?.guidelines || 'Guidelines'}</Link>
        </div>
      </div>
    </section>
  )
}