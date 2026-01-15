"use client";
import React, { useEffect, useState } from 'react';
import styles from './digitalClock.module.scss';

export interface DigitalClockProps {
  showSeconds?: boolean;
  showDate?: boolean;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export default function DigitalClock({ showSeconds = true, showDate = true }: DigitalClockProps) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
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

  return (
    <div className={styles.clock} aria-live="polite">
      {showDate && <div className={styles.date}>{dateStr}</div>}
      <div className={styles.timeRow}>
        <div className={styles.time}>
          {/* Hours (may be 1 or 2 digits) */}
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
  );
}
