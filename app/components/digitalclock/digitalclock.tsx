"use client";
import { useEffect, useState } from 'react';
import styles from './digitalclock.module.scss';

export interface DigitalClockProps {
  showSeconds?: boolean;
  showDate?: boolean;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export default function DigitalClock({ showSeconds = true, showDate = true }: DigitalClockProps) {
  // Use a deterministic initial value to avoid SSR/CSR hydration mismatches.
  // Initialize to epoch so server and client render identical markup before mount.
  const [now, setNow] = useState<Date>(new Date(0));
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem('digitalClockVisible');
      if (v !== null) setVisible(v === '1');
    } catch (e) {
      // ignore (e.g., SSR or privacy settings)
    }
  }, []);

  useEffect(() => {
    // Set the actual time only after mount to keep server and client initial HTML identical.
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hours24 = now.getHours();
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours24 >= 12 ? 'PM' : 'AM';

  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();

  const dateStr = `${pad(month)}/${pad(day)}/${year}`;

  const timeDigits = [String(hours12), pad(minutes)];
  if (showSeconds) timeDigits.push(pad(seconds));

  const toggle = () => {
    const next = !visible;
    setVisible(next);
    try {
      localStorage.setItem('digitalClockVisible', next ? '1' : '0');
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className={`${styles.floatingWrapper} ${styles.clock} ${visible ? styles.visible : styles.hidden}`} aria-live="polite">
      <button
        className={styles.toggleButton}
        onClick={toggle}
        aria-expanded={visible}
        aria-controls="digital-clock-box"
        aria-label={visible ? 'Hide clock' : 'Show clock'}
      >
        <small>Today</small> 
        <svg
          className={`${styles.toggleIcon} ${visible ? '' : styles.rotated}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
          focusable="false"
        >
          <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
        </svg>
      </button>
      <div id="digital-clock-box" role="status">
        {showDate && <div className={styles.date}>{dateStr}</div>}
        <div className={styles.timeRow}>
          <div className={styles.time}>
            <div className={styles.digits}>
              {String(hours12).split('').map((d, i) => (
                <span key={`h${i}`} className={styles.digit} aria-hidden>{d}</span>
              ))}
              <span className={styles.colon} aria-hidden>:</span>
              {pad(minutes).split('').map((d, i) => (
                <span key={`m${i}`} className={styles.digit} aria-hidden>{d}</span>
              ))}
              {showSeconds && (
                <>
                  <span className={styles.colon} aria-hidden>:</span>
                  {pad(seconds).split('').map((d, i) => (
                    <span key={`s${i}`} className={styles.digit} aria-hidden>{d}</span>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className={styles.ampm}>
            <span>{ampm}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
