/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import fs from 'fs';
import { createGenerateMetadata } from '@lib/pageUtils';
import path from 'path';
import HeroSection from '@components/herosection';
import WelcomePage from '@components/welcome';
import UnderstandingOfSanatana from '@components/sanatanadharmam';
import OurFourCoreYugas from '@components/ourfourcoreyugas';
import GitSupport from '@components/git-support';

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
        {/* <DigitalClockLoader /> */}
        {/* Krishna flute background audio player in footer, loads after 1 minute */}
        {/* <AudioPlayer
          tracks={{
            id: "solo",
            title: "Single Track",
            sources: [
              { src: "/audios/krishna-flute.mp3", type: "audio/mpeg" },
              { src: "/audios/krishna-flute.ogg", type: "audio/ogg" },
            ],
          }}
          autoPlay={false}
          muted={false}
          loop={false}
          showPlaylist={false}
        /> */}
      </main>
    </>
  );
}       