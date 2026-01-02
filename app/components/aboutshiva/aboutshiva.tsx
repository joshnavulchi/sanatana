import { t, DEFAULT_LOCALE } from '../../../lib/i18n';
import { parseList } from 'lib/parseList';

import styles from './aboutshiva.module.scss';

export default function AboutShiva({ locale }: { locale?: string }) {
  return (
    <section className={styles.aboutshiva}>
      <div className="content-wrapper text-left">
        <div className="multi-text-color">
          {parseList(t('home.shivaHeading', locale || DEFAULT_LOCALE)).map((s, i) => <span key={i}>{s} </span>)}
        </div>
        <div></div>
      </div>
      <div className="content-wrapper">
        <div className={`${styles.history} mx-auto max-w-7xl flex flex-col md:flex-row items-start justify-between gap-8`}>
          <div className="w-full md:w-1/3 text-center">
            <b className="text-large">{t('home.stat1', locale || DEFAULT_LOCALE)}</b>
            <p className="text-extrasmall">
              {t('home.stat1Desc', locale || DEFAULT_LOCALE)} <br />
              {/* <span>{t('home.stat1Extra', locale || DEFAULT_LOCALE) || ''}</span> */}
            </p>
          </div>
          <div className="w-full md:w-1/3 text-center">
            <b className="text-large">{t('home.stat2', locale || DEFAULT_LOCALE)}</b>
            <p className="text-extrasmall">
              {t('home.stat2Desc', locale || DEFAULT_LOCALE)} <br />
              {/* <span>{t('home.stat2Extra', locale || DEFAULT_LOCALE) || ''}</span> */}
            </p>
          </div>
          <div className="w-full md:w-1/3 text-center">
            <b className="text-large">{t('home.stat3', locale || DEFAULT_LOCALE)}</b>
            <p className="text-extrasmall">
              {t('home.stat3Desc', locale || DEFAULT_LOCALE)}<br />
              {/* <span>{t('home.stat3Extra', locale || DEFAULT_LOCALE) || ''}</span> */}
            </p>
          </div>
        </div>
        <div className="text-left">
          <div className="multi-text-color">
            {parseList(t('home.lingamText', locale || DEFAULT_LOCALE)).map((s, i) => <span key={i}>{s} </span>)}
          </div>
        </div>
      </div>
    </section>
  );
}