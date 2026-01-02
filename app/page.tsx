/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { detectLocale, t } from '../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import HeroSection from './components/hero-section/herosection';
import GayathriStotram from './components/gayathri-stotram/gayathristotram';
import GitSupport from './components/git-support/git-support';
import OurFourCoreYugas from './components/our-four-core-yugas/ourfourcoreyugas';
import AboutShiva from './components/aboutshiva/aboutshiva';
import UnderstandingOfSanatana from './components/understanding/sanatanaDharmam';

export const generateMetadata = createGenerateMetadata('home');

export default async function Home() {
  const locale = detectLocale() || resolveLocaleFromHeaders();
  return (
    <>
      <main>
        <HeroSection />
        <UnderstandingOfSanatana />
        {/* <MainSlider />
        <KrishnaStotram />
        <SanatanaDharma />
        <ShivaStotram /> */}
        <GayathriStotram />
        <GitSupport />
        <OurFourCoreYugas />
        <AboutShiva />
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */