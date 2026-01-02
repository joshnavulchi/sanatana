import { symbol } from 'd3';
import { t, DEFAULT_LOCALE } from '../../../lib/i18n';
import styles from './gayathristotram.module.scss';

export default function GayathriStotram({ locale }: { locale?: string }) {
  const loc = locale || DEFAULT_LOCALE;
  const heading = t('home.gayathri.heading', loc);
  return (
    <section className={styles.gayathristotram}>
      <div className="text-center">
        <h4 className={`${styles.title} multi-text-color`}>
          {Array.isArray(heading) ? (heading as string[]).map((s, i) => <span key={i}>{s} </span>) : <span>{String(heading)}</span>}
        </h4>
        <p>{t('home.gayathri.transliteration', loc)}</p>
        <p>{t('home.gayathri.translation', loc)}</p>
      </div>
    </section>
  )
}