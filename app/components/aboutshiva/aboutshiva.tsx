import { t, DEFAULT_LOCALE } from '../../../lib/i18n';
import { parseList } from 'lib/parseList';

import styles from './aboutshiva.module.scss';

export default function AboutShiva({ locale }: { locale?: string }) {
  return (
    <div className="background-alternative">
      <div className="content-wrapper">
        <div className="multi-text-color">
          {parseList(t('home.shivaheading', locale || DEFAULT_LOCALE)).map((s, i) => <span key={i}>{s} </span>)}
        </div>
        <div className={`${styles.history} flex flex-col md:flex-row items-start justify-between gap-8`}>
          <div className="w-full md:w-1/3 text-center">
            <b className="title">{t('home.stat1', locale || DEFAULT_LOCALE)}</b>
            <p>
              {t('home.stat1desc', locale || DEFAULT_LOCALE)} <br />
              {/* <span>{t('home.stat1Extra', locale || DEFAULT_LOCALE) || ''}</span> */}
            </p>
          </div>
          <div className="w-full md:w-1/3 text-center">
            <b className="title">{t('home.stat2', locale || DEFAULT_LOCALE)}</b>
            <p>
              {t('home.stat2desc', locale || DEFAULT_LOCALE)} <br />
              {/* <span>{t('home.stat2Extra', locale || DEFAULT_LOCALE) || ''}</span> */}
            </p>
          </div>
          <div className="w-full md:w-1/3 text-center">
            <b className="title">{t('home.stat3', locale || DEFAULT_LOCALE)}</b>
            <p>
              {t('home.stat3desc', locale || DEFAULT_LOCALE)}<br />
              {/* <span>{t('home.stat3Extra', locale || DEFAULT_LOCALE) || ''}</span> */}
            </p>
          </div>
        </div>
        <div className="multi-text-color">
          {parseList(t('home.lingamtext', locale || DEFAULT_LOCALE)).map((s, i) => <span key={i}>{s} </span>)}
        </div>
      </div>
    </div>
  );
}