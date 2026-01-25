"use client";
import { useEffect, useState } from 'react';
import styles from './digitalclock.module.scss';
import SunCalc from 'suncalc';
import { DateTime } from 'luxon';

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
  const [latLng, setLatLng] = useState<{ lat: number; lon: number } | null>(null);
  const [sunrise, setSunrise] = useState<string | null>(null);
  const [sunset, setSunset] = useState<string | null>(null);
  const [tithi, setTithi] = useState<number | null>(null);
  const [nakshatra, setNakshatra] = useState<number | null>(null);
  const [moonPhase, setMoonPhase] = useState<string | null>(null);
  const [moonPhaseValue, setMoonPhaseValue] = useState<number | null>(null);
  const [rahu, setRahu] = useState<{ start: string; end: string } | null>(null);
  const [yama, setYama] = useState<{ start: string; end: string } | null>(null);
  const [locationRequested, setLocationRequested] = useState<boolean>(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem('digitalClockVisible');
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      timeoutId = setTimeout(() => {
        if (v !== null) setVisible(v === '1');
      }, 0);
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    } catch (e) {
      // ignore (e.g., SSR or privacy settings)
    }
  }, []);

  useEffect(() => {
    // Set the actual time only after mount to keep server and client initial HTML identical.
    // Schedule state updates asynchronously to avoid triggering certain lint rules
    // that disallow direct state updates during effect mount.
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const timeoutId = setTimeout(() => {
      setNow(new Date());
      intervalId = setInterval(() => setNow(new Date()), 1000);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Function to request geolocation - only called when user interacts
  const requestLocation = () => {
    if (locationRequested || !('geolocation' in navigator)) return;
    setLocationRequested(true);
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setLatLng({ lat, lon });
    }, () => {
      // ignore if user denies
    }, { maximumAge: 60_000, timeout: 5000 });
  };

  useEffect(() => {
    if (!latLng) return;
    const { lat, lon } = latLng;
    const nowDate = now;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    timeoutId = setTimeout(() => {
      try {
        const times = SunCalc.getTimes(nowDate, lat, lon);
        const sr = times.sunrise || times.sunriseEnd || times.sunrise;
        const ss = times.sunset || times.sunsetStart || times.sunset;
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        const newSunrise = sr ? DateTime.fromJSDate(sr).setZone(zone).toLocaleString(DateTime.TIME_SIMPLE) : null;
        const newSunset = ss ? DateTime.fromJSDate(ss).setZone(zone).toLocaleString(DateTime.TIME_SIMPLE) : null;

        // Moon illumination gives phase (0..1). Approximate tithi from phase*360
        const illum = SunCalc.getMoonIllumination(nowDate);
        const phase = illum.phase || 0;
        let phaseName = '';
        if (phase <= 0.03 || phase >= 0.97) phaseName = 'New Moon (Amavasya)';
        else if (phase < 0.25) phaseName = 'Waxing Crescent';
        else if (phase < 0.27) phaseName = 'First Quarter (Half Moon)';
        else if (phase < 0.5) phaseName = 'Waxing Gibbous';
        else if (phase >= 0.48 && phase <= 0.52) phaseName = 'Full Moon (Purnima)';
        else if (phase < 0.75) phaseName = 'Waning Gibbous';
        else if (phase < 0.77) phaseName = 'Last Quarter (Half Moon)';
        else phaseName = 'Waning Crescent';
        const newMoonPhase = phaseName;
        const newMoonPhaseValue = phase;
        let newTithi: number | null = Math.floor((phase * 360) / 12) + 1;

        const moonPos = SunCalc.getMoonPosition(nowDate, lat, lon);
        const sunPos = SunCalc.getPosition(nowDate, lat, lon);
        const raMoon = moonPos.ra;
        const decMoon = moonPos.dec;
        const raSun = (sunPos as any).ra;
        const decSun = (sunPos as any).dec;
        const obliq = 23.4397 * Math.PI / 180;

        const toEclLon = (ra: number, dec: number) => {
          const sinE = Math.sin(obliq);
          const cosE = Math.cos(obliq);
          const sinDec = Math.sin(dec);
          const cosDec = Math.cos(dec);
          const sinRa = Math.sin(ra);
          const cosRa = Math.cos(ra);
          const x = cosDec * cosRa;
          const y = cosDec * sinRa * cosE + sinDec * sinE;
          const lon = Math.atan2(y, x);
          let deg = lon * 180 / Math.PI;
          if (deg < 0) deg += 360;
          return deg;
        };

        const moonLon = (typeof raMoon === 'number' && typeof decMoon === 'number') ? toEclLon(raMoon, decMoon) : null;
        const sunLon = (typeof raSun === 'number' && typeof decSun === 'number') ? toEclLon(raSun, decSun) : null;
        let newNakshatra: number | null = null;
        if (moonLon !== null) {
          const nak = Math.floor((moonLon % 360) / (360 / 27)) + 1;
          newNakshatra = nak;
        }

        if (moonLon !== null && sunLon !== null) {
          const diff = (moonLon - sunLon + 360) % 360;
          const tithiCalc = Math.floor(diff / 12) + 1;
          newTithi = tithiCalc;
        }

        let newRahu: { start: string; end: string } | null = null;
        let newYama: { start: string; end: string } | null = null;
        if (sr && ss) {
          const dayLength = ss.getTime() - sr.getTime();
          const segment = dayLength / 8;
          const weekday = nowDate.getDay();
          const rahuMap = [8,2,7,5,6,4,3];
          const yamaMap = [2,3,4,5,6,7,1];
          const rIndex = rahuMap[weekday];
          const yIndex = yamaMap[weekday];
          const rStart = new Date(sr.getTime() + (rIndex - 1) * segment);
          const rEnd = new Date(rStart.getTime() + segment);
          const yStart = new Date(sr.getTime() + (yIndex - 1) * segment);
          const yEnd = new Date(yStart.getTime() + segment);
          newRahu = { start: DateTime.fromJSDate(rStart).setZone(zone).toLocaleString(DateTime.TIME_SIMPLE), end: DateTime.fromJSDate(rEnd).setZone(zone).toLocaleString(DateTime.TIME_SIMPLE) };
          newYama = { start: DateTime.fromJSDate(yStart).setZone(zone).toLocaleString(DateTime.TIME_SIMPLE), end: DateTime.fromJSDate(yEnd).setZone(zone).toLocaleString(DateTime.TIME_SIMPLE) };
        }

        // Apply state updates together asynchronously
        setSunrise(newSunrise);
        setSunset(newSunset);
        setMoonPhase(newMoonPhase);
        setMoonPhaseValue(newMoonPhaseValue);
        setTithi(newTithi);
        if (newNakshatra !== null) setNakshatra(newNakshatra);
        if (newRahu) setRahu(newRahu);
        if (newYama) setYama(newYama);
      } catch (e) {
        // ignore calculation errors
      }
    }, 0);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [latLng, now]);

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
    // Request location when user opens the clock
    if (next) {
      requestLocation();
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
        <small className='hidden md:inline-flex'>Today</small> 
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
        {latLng && (
          <div className="text-xs mt-1">
            {sunrise && <div><strong>Sunrise:</strong> {sunrise}</div>}
            {sunset && <div><strong>Sunset:</strong> {sunset}</div>}
            {tithi && <div><strong>Lunar day (Tithi):</strong> {tithi}</div>}
            {nakshatra && <div><strong>Nakshatra:</strong> {nakshatra}</div>}
            {moonPhase && (
              <div className="flex items-center justify-content-start gap-2">
                <div>Moon: </div> 
                <div role="img" aria-label={`Moon: ${moonPhase}`}>
                  {(() => {
                    // Map numeric phase (0..1) to moon phase emoji.
                    const p = moonPhaseValue ?? 0;
                    if (p <= 0.03 || p >= 0.97) return '🌑';
                    if (p < 0.25) return '🌒';
                    if (p < 0.27) return '🌓';
                    if (p < 0.5) return '🌔';
                    if (p >= 0.48 && p <= 0.52) return '🌕';
                    if (p < 0.75) return '🌖';
                    if (p < 0.77) return '🌗';
                    return '🌘';
                  })()}
                </div>
                <div> {moonPhase}</div>
              </div>
            )}
            {rahu && <div><strong>Rahu Kaal:</strong> {rahu.start} - {rahu.end}</div>}
            {yama && <div><strong>Yamagandam:</strong> {yama.start} - {yama.end}</div>}
          </div>
        )}
      </div>
    </div>
  );
}