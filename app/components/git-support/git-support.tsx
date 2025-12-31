import Link from 'next/link';
import WorldMapAnimated from '../worldmap/wordmap';
import { t, DEFAULT_LOCALE } from '../../../lib/i18n';

export default function GitSupport({ locale }: { locale?: string }) {
  const loc = locale || DEFAULT_LOCALE;
  return (
    <section className="gradient-background map-wrapper md:md:min-h-160 relative z-0 overflow-hidden">
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
      <div className="content-wrapper cta-content md:absolute md:top-1/2 md:left-20 md:-translate-y-1/2 md:z-1">
        <h6 className="text-large">{t('cta.title', loc)}</h6>
        <p className="text-extrasmall">{t('cta.subtitle', loc)}</p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="https://github.com/vulchivijay/first-contributes" target="_blank" className="button inline-block shadow-sm bg-amber-300 hover:bg-amber-400 no-underline">{t('cta.contribute', loc)}</Link>
          <Link href="https://github.com/vulchivijay/first-contributes" target="_blank" className="button inline-block shadow-sm bg-white/75 hover:bg-white no-underline">{t('cta.guidelines', loc)}</Link>
        </div>
      </div>
    </section>
  )
}