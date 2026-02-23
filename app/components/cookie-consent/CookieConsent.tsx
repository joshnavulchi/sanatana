/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useEffect, useState } from 'react';
import storage from '@lib/storage';
import { loadGtag, loadGTM } from '@lib/analyticsLoader';
import { DEFAULT_LOCALE } from '@lib/i18n';
import useLocaleSection from '@app/hooks/useLocaleSection';
import CookiePreferencesModal from './CookiePreferencesModal';

type Prefs = {
  strictlyNecessary: boolean;
  functionality?: boolean;
  performance?: boolean;
  targeting?: boolean;
};

function detectBrowserAndOS() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const lower = ua.toLowerCase();
  let browserName = 'unknown';
  let browserVersion = '';
  let osName = 'unknown';
  let osVersion = '';

  // Browser detection (basic)
  if (/edg\//i.test(ua)) {
    browserName = 'Edge';
    const m = ua.match(/Edg\/(\d+(?:\.\d+)*)/i);
    if (m) browserVersion = m[1];
  } else if (/chrome\//i.test(ua)) {
    browserName = 'Chrome';
    const m = ua.match(/Chrome\/(\d+(?:\.\d+)*)/i);
    if (m) browserVersion = m[1];
  } else if (/firefox\//i.test(ua)) {
    browserName = 'Firefox';
    const m = ua.match(/Firefox\/(\d+(?:\.\d+)*)/i);
    if (m) browserVersion = m[1];
  } else if (/safari/i.test(ua) && /version\//i.test(ua)) {
    browserName = 'Safari';
    const m = ua.match(/Version\/(\d+(?:\.\d+)*)/i);
    if (m) browserVersion = m[1];
  }

  // OS detection (basic)
  if (/windows nt/i.test(ua)) {
    osName = 'Windows';
    const m = ua.match(/Windows NT (\d+(?:\.\d+)*)/i);
    if (m) osVersion = m[1];
  } else if (/android/i.test(ua)) {
    osName = 'Android';
    const m = ua.match(/Android (\d+(?:\.\d+)*)/i);
    if (m) osVersion = m[1];
  } else if (/iphone os|ipad; cpu os/i.test(ua)) {
    osName = 'iOS';
    const m = ua.match(/OS (\d+_\d+(?:_\d+)*)/i);
    if (m) osVersion = m[1].replace(/_/g, '.');
  } else if (/mac os x/i.test(ua)) {
    osName = 'macOS';
    const m = ua.match(/Mac OS X (\d+_\d+(?:_\d+)*)/i);
    if (m) osVersion = m[1].replace(/_/g, '.');
  }

  return { ua, browserName, browserVersion, osName, osVersion };
}

async function getCoords(timeout = 2000) {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    let called = false;
    const timer = setTimeout(() => {
      if (!called) {
        called = true;
        resolve(null);
      }
    }, timeout);
    navigator.geolocation.getCurrentPosition((pos) => {
      if (called) return;
      called = true;
      clearTimeout(timer);
      resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    }, () => {
      if (called) return;
      called = true;
      clearTimeout(timer);
      resolve(null);
    }, { maximumAge: 60 * 1000, timeout });
  });
}

async function saveToServer(prefs: Prefs) {
  const uaInfo = detectBrowserAndOS();
  const coords = await getCoords(2000).catch(() => null);

  const payload = {
    prefs,
    ts: new Date().toISOString(),
    ua: uaInfo.ua,
    browserName: uaInfo.browserName,
    browserVersion: uaInfo.browserVersion,
    osName: uaInfo.osName,
    osVersion: uaInfo.osVersion,
    coords,
  };

  return fetch('/api/cookies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs | null>(null);

  useEffect(() => {
    try {
      const v = storage.getItem('sd_cookie_prefs');
      if (v) {
        setTimeout(() => setPrefs(JSON.parse(v)), 0);
        setTimeout(() => setVisible(false), 0);
      } else {
        setTimeout(() => setVisible(true), 0);
      }
    } catch (err) {
      setTimeout(() => setVisible(true), 0);
    }
  }, []);

  async function acceptAll() {
    const p: Prefs = { strictlyNecessary: true, functionality: true, performance: true, targeting: true };
    setPrefs(p);
    try {
      storage.setItem('sd_cookie_prefs', JSON.stringify(p));
    } catch (e) {
      // ignore
    }
    try { await saveToServer(p); } catch (err) { /* ignore */ }
    // Load analytics now that user consented
    try { loadGtag(process.env.NEXT_PUBLIC_GA_ID); } catch { }
    try { loadGTM(process.env.NEXT_PUBLIC_GTM_ID); } catch { }
    setVisible(false);
  }

  async function savePrefs(newPrefs: Record<string, boolean>) {
    const p: Prefs = {
      strictlyNecessary: true,
      functionality: !!newPrefs.functionality,
      performance: !!newPrefs.performance,
      targeting: !!newPrefs.targeting,
    };
    setPrefs(p);
    try {
      storage.setItem('sd_cookie_prefs', JSON.stringify(p));
    } catch (e) {
      // ignore
    }
    try { await saveToServer(p); } catch (err) { /* ignore */ }
    // Load analytics selectively based on granted preferences
    if (p.performance || p.targeting) {
      try { loadGtag(process.env.NEXT_PUBLIC_GA_ID); } catch { }
      try { loadGTM(process.env.NEXT_PUBLIC_GTM_ID); } catch { }
    }
  }

  const localeObj = useLocaleSection('sharable_strings');

  if (!visible) return null;

  return (
    <>
      <CookiePreferencesModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={savePrefs} initial={prefs ?? {}} />
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <div className="
            relative
            bg-white/95
            backdrop-blur-xl
            border-2 border-amber-200
            rounded-2xl
            shadow-2xl
            overflow-hidden
          ">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none" />

            {/* Top border accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Cookie icon */}
                <div className="flex-shrink-0 hidden md:block">
                  <div className="
                    w-16 h-16
                    bg-gradient-to-br from-amber-100 to-orange-100
                    rounded-2xl
                    flex items-center justify-center
                    text-4xl
                    shadow-lg
                    animate-bounce
                  ">
                    🍪
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl md:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="md:hidden text-2xl">🍪</span>
                    Cookie Settings
                  </h3>
                  <div className="text-md  leading-relaxed">
                    {(() => {
                      const paragraph = localeObj?.cookieconsent?.paragraph || '';
                      return (
                        <div dangerouslySetInnerHTML={{
                          __html: paragraph
                            .replace('{cookiePolicyLink}', `<a class="text-amber-800 hover:text-orange-700 underline underline-offset-2 transition-colors" href="/our-cookie-policy">${localeObj?.cookieconsent?.cookiepolicy || 'Cookie Policy'}</a>`)
                            .replace('{privacyPolicyLink}', `<a class="text-amber-800 hover:text-orange-700 underline underline-offset-2 transition-colors" href="/our-privacy-policy">${localeObj?.cookieconsent?.privacypolicy || 'Privacy Policy'}</a>`)
                            .replace('{managerLabel}', localeObj?.cookieconsent?.managerbutton || 'Cookie Preferences')
                            .replace('{acceptAllLabel}', localeObj?.cookieconsent?.acceptall || 'Accept all')
                        }} />
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-6">
                <button
                  className="
                      px-6 py-3
                      bg-white
                      border-2 border-amber-300
                      hover:border-amber-400
                      text-gray-900
                      font-semibold text-xl md:text-lg
                      rounded-full
                      shadow-md hover:shadow-lg
                      transition-all duration-300
                      transform hover:-translate-y-0.5
                      no-underline
                      whitespace-nowrap
                      cursor-pointer
                  "
                  onClick={() => setModalOpen(true)}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {localeObj?.cookieconsent?.managerbutton || 'Cookie Preferences'}
                  </span>
                </button>
                <button
                  className="
                    px-6 py-3
                    bg-gradient-to-r from-amber-500 to-orange-600
                    hover:from-amber-600 hover:to-orange-700
                    text-white
                    font-semibold text-xl md:text-lg
                    rounded-full
                    shadow-lg hover:shadow-xl
                    transition-all duration-300
                    transform hover:-translate-y-0.5
                    no-underline
                    whitespace-nowrap
                    cursor-pointer
                  "
                  onClick={acceptAll}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {localeObj?.cookieconsent?.acceptall || 'Accept all'}
                  </span>
                </button>
              </div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-400/10 to-transparent rounded-tl-full pointer-events-none" />
          </div>
        </div>
      </div>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
