/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import fs from 'fs';
import { createGenerateMetadata } from 'lib/pageUtils';
import path from 'path';
import GitSupport from './components/git-support/git-support';
import HeroSection from './components/hero-section/herosection';
import OurFourCoreYugas from './components/our-four-core-yugas/ourfourcoreyugas';
import UnderstandingOfSanatana from './components/understanding/sanatanaDharmam';
import WelcomePage from './components/welcome/page';
import DelayedHomeWidgets from './components/DelayedHomeWidgets';
import FooterAudioPlayer from './components/FooterAudioPlayer';

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
  // Get cached critical CSS (read once at module load)
  const criticalCss = getCriticalCss();

  // Delayed audio component for Krishna flute

  return (
    <>
      {criticalCss ? <style dangerouslySetInnerHTML={{ __html: criticalCss }} /> : null}
      <main>
        <WelcomePage />
        <HeroSection />
        <UnderstandingOfSanatana />
        <GitSupport />
        <OurFourCoreYugas />
        {/* Delayed widgets: cookies and clock */}
        {/* <DelayedHomeWidgets />  // Disabled: causes server/client boundary error */}
        {/* Krishna flute background audio player in footer, loads after 1 minute */}
        <FooterAudioPlayer />
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */