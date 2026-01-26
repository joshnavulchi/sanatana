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
  // Inline generated critical CSS for Home page if present (keeps under 5-8KB).
  // Defensive: only inline when the file exists, is reasonably small, and
  // does not appear to contain Tailwind directives or full-site styles which
  // can unintentionally override responsive behavior. This prevents a
  // malformed or broad critical CSS from breaking the entire site.
  let criticalCss = '';
  try {
    const p = path.join(process.cwd(), 'public', 'critical-home.css');
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const tooLarge = raw.length > 8 * 1024; // 8KB
      const looksLikeFullCss = /@tailwind|@import|:root|body\s*\{|html\s*\{/.test(raw);
      if (!tooLarge && !looksLikeFullCss) criticalCss = raw;
      else {
        // Avoid inlining dangerous/large CSS which may break layout; keep file
        // available in `public/` for manual inspection or client-side loading.
        // eslint-disable-next-line no-console
        console.warn(`Skipping inline critical CSS (size:${raw.length} bytes, looksLikeFullCss:${looksLikeFullCss})`);
      }
    }
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