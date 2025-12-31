/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { detectLocale, t } from '../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from 'lib/pageUtils';
import MainSlider from './components/main-slider/slider';
import SanatanaDharma from './components/sanatanadharma/sanatanadharma';
import KrishnaStotram from './components/krishna-stotram/krishnastotram';
import GayathriStotram from './components/gayathri-stotram/gayathristotram';
import ShivaStotram from './components/shiva-stotram/shivastotram';
import GitSupport from './components/git-support/git-support';
import OurFourCoreYugas from './components/our-four-core-yugas/ourfourcoreyugas';
import AboutShiva from './components/aboutshiva/aboutshiva';
export const generateMetadata = createGenerateMetadata('home');

export default async function Home() {
  const locale = detectLocale() || resolveLocaleFromHeaders();
  return (
    <>
      <main>
        <MainSlider />
        <KrishnaStotram />
        <SanatanaDharma />
        <ShivaStotram />
        <GayathriStotram />
        <OurFourCoreYugas />
        <GitSupport />
        <AboutShiva />
      </main>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */