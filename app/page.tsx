/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import fs from 'fs';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import path from 'path';
import { detectLocale, t } from '../lib/i18n';
import GitSupport from './components/git-support/git-support';
import HeroSection from './components/hero-section/herosection';
import OurFourCoreYugas from './components/our-four-core-yugas/ourfourcoreyugas';
import UnderstandingOfSanatana from './components/understanding/sanatanaDharmam';
import WelcomePage from './components/welcome/page';
import DelayedHomeWidgets from './components/DelayedHomeWidgets';
import React, { useEffect, useRef } from 'react';

// Cache critical CSS at module level to avoid repeated file reads
let cachedCriticalCss: string | null = null;
let criticalCssChecked = false;

function getCriticalCss(): string {
  if (criticalCssChecked) return cachedCriticalCss || '';

  try {
    const p = path.join(process.cwd(), 'public', 'critical-home.css');
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const tooLarge = raw.length > 8 * 1024; // 8KB
      const looksLikeFullCss = /@tailwind|@import|:root|body\s*\{|html\s*\{/.test(raw);
      if (!tooLarge && !looksLikeFullCss) {
        cachedCriticalCss = raw;
      } else {
        console.warn(`Skipping inline critical CSS (size:${raw.length} bytes, looksLikeFullCss:${looksLikeFullCss})`);
      }
    }
  } catch (e) {
    // Ignore errors
  }

  criticalCssChecked = true;
  return cachedCriticalCss || '';
}

export const generateMetadata = createGenerateMetadata('home');

export default async function Home() {
  const locale = detectLocale() || resolveLocaleFromHeaders();
  // Get cached critical CSS (read once at module load)
  const criticalCss = getCriticalCss();

  // Delayed audio component for Krishna flute
    // Footer audio player with error handling
    function FooterAudioPlayer() {
      const audioRef = useRef(null);
      const [error, setError] = React.useState(false);
      const [showPlayer, setShowPlayer] = React.useState(false);
      useEffect(() => {
        const timer = setTimeout(() => {
          setShowPlayer(true);
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }, 60000); // 1 minute
        return () => clearTimeout(timer);
      }, []);
      return (
        <footer style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', zIndex: 1000, textAlign: 'center', background: 'transparent' }}>
          {showPlayer && (
            <>
              <audio
                ref={audioRef}
                src="/krishna-flute.mp3"
                preload="auto"
                loop
                style={{ width: 120, height: 30 }}
                onError={() => setError(true)}
              />
              {error && (
                <div style={{ color: 'red', fontSize: '0.8rem', marginTop: 4 }}>
                  Krishna flute audio not found. Please upload krishna-flute.mp3 in public folder.<br />
                  <audio controls style={{ width: 120, height: 30 }}>
                    <source src="" type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </>
          )}
        </footer>
      );
    }

  return (
    <>
      {criticalCss ? <style dangerouslySetInnerHTML={{ __html: criticalCss }} /> : null}
      {/* Krishna flute background audio player in footer, loads after 1 minute */}
      <FooterAudioPlayer />
      <main>
        <WelcomePage />
        <HeroSection />
        <UnderstandingOfSanatana />
        <GitSupport />
        <OurFourCoreYugas />
        {/* Delayed widgets: cookies and clock */}
        <DelayedHomeWidgets />
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */