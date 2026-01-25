/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { detectLocale, t } from '../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import fs from 'fs';
import path from 'path';
import HeroSection from './components/hero-section/herosection';
import UnderstandingOfSanatana from './components/understanding/sanatanaDharmam';
import GitSupport from './components/git-support/git-support';
import OurFourCoreYugas from './components/our-four-core-yugas/ourfourcoreyugas';

export const generateMetadata = createGenerateMetadata('home');

export default async function Home() {
  const locale = detectLocale() || resolveLocaleFromHeaders();
  // Inline generated critical CSS for Home page if present (keeps under 5-8KB)
  let criticalCss = '';
  try {
    const p = path.join(process.cwd(), 'public', 'critical-home.css');
    if (fs.existsSync(p)) criticalCss = fs.readFileSync(p, 'utf8');
  } catch (e) {
    criticalCss = '';
  }
  return (
    <>
      {criticalCss ? <style dangerouslySetInnerHTML={{ __html: criticalCss }} /> : null}
      <main>
        <HeroSection />
        <UnderstandingOfSanatana />
        <GitSupport />
        <OurFourCoreYugas />
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */