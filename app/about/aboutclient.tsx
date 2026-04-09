"use client";

import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import TextToSpeech from '@components/text-to-speech/TextToSpeech';
import PageLayout from '@components/common/PageLayout';
import { parseMaybeObject } from '@/lib/parse';
import FaqAccordion from '../components/faqaccordion/faqaccordion';

type Props = {
  initialTitle?: string;
};

export default function AboutClient({ initialTitle = '' }: Props) {
  const isVisible = true;
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('about');

  // Compute about object directly from ns
  const about = {
    title: String(ns?.title || initialTitle),
    description: String(ns?.description || ''),
    sections: Array.isArray(ns?.sections) ? ns.sections : [],
    disclaimer: String(ns?.disclaimer || ''),
    faq: parseMaybeObject(ns?.faq || '')
  };

  // Show loading state if locale is still loading and we have no content
  if (isLoading && !about.title) {
    return (
      <PageLayout
        metaKey="about"
        title={about?.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'About' }]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-4 text-md sm:text-base leading-relaxed font-normal">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        metaKey="about"
        title={about.title}
        description={about.description || ''}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: about.title }]}
        className="layout-md"
      >
        {/* Text-to-Speech Player */}
        <TextToSpeech sectionId="about-content" className="floating" />

        <div id="about-content" className='space-y-8'>

          {/* Sections as cards */}
          {about.sections.map((section: any, index: number) => {
            const level = Math.min(index + 2, 6);
            const Tag = `h${level}` as unknown as React.ElementType;

            // Icon mapping for different section types
            const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
            const icon = icons[index % icons.length];

            return (
              <div key={section.id || index}
                className="relative bg-white rounded-2xl p-4 md:p-8 shadow-md hover:shadow-xl transition-all duration-500 group overflow-hidden">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-tr-2xl text-md sm:text-base leading-relaxed font-normal" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-bl-2xl text-md sm:text-base leading-relaxed font-normal" />

                {/* Content */}
                <div className="relative z-10 space-y-4 text-md sm:text-base leading-relaxed font-normal">
                  {/* Section header with icon */}
                  <div className="flex items-start gap-4 text-md sm:text-base leading-relaxed font-normal">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 text-md sm:text-base leading-relaxed font-normal">
                      {icon}
                    </div>
                    <Tag className="flex-1 text-2xl text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                      {section.title}
                    </Tag>
                  </div>

                  {/* Section content */}
                  {section?.content && (
                    <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                      {section.content}
                    </p>
                  )}

                  {/* Points list */}
                  {section?.points && section?.points.length > 0 && (
                    <ul className="space-y-3 list-disc pl-5 text-md sm:text-base leading-relaxed">
                      {section.points.map((text: string, idx: number) => (
                        <li key={idx} className="relative flex items-start gap-3 mb-2">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full text-md sm:text-base leading-relaxed font-normal" />
                          <span className="flex-1 text-md sm:text-base leading-relaxed font-normal">{text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}

          {/* Disclaimer section */}
          {about.disclaimer && (
            <div className="relative rounded-lg p-4 md:p-8 shadow-lg text-md sm:text-base leading-relaxed font-normal">
              <div className="flex items-start gap-4 text-md sm:text-base leading-relaxed font-normal">
                <span className="text-md sm:text-base leading-relaxed font-normal">⚠️</span>
                <div className="flex-1 text-md sm:text-base leading-relaxed font-normal">
                  <h4 className="text-xl md:text-md sm:text-base font-semibold text-gray-900 mb-2">Disclaimer</h4>
                  <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                    {about.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mx-auto max-w-7xl py-4 px-3 text-md sm:text-base leading-relaxed font-normal">
          <div
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Header */}
            <div className="text-center text-md sm:text-base leading-relaxed font-normal">
              <div className="flex items-center justify-center gap-3 text-md sm:text-base leading-relaxed font-normal">
                <div className="h-px w-16 text-md sm:text-base leading-relaxed font-normal" />
                <span className="text-amber-800 text-md sm:text-base leading-relaxed font-normal">🕉️</span>
                <div className="h-px w-16 text-md sm:text-base leading-relaxed font-normal" />
              </div>
              <h3 className="bg-clip-text text-2xl font-semibold leading-snug mb-3">
                The Essence of Life
              </h3>
              <p className="text-amber-700/80 italic text-md sm:text-base leading-relaxed mb-4 font-normal">
                जीवनस्य परमं तत्त्वम्
              </p>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 text-md sm:text-base leading-relaxed font-normal">
              {/* Card 1: Purpose */}
              <div className="relative rounded-xl p-4 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-1 text-md sm:text-base leading-relaxed font-normal">
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity text-md sm:text-base leading-relaxed font-normal">
                  🎯
                </div>
                <h4 className="text-amber-800 text-xl font-semibold leading-snug mb-2">पुरुषार्थ - Life&apos;s Purpose</h4>
                <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                  Life is a sacred journey toward the four Purusharthas:
                  <span className="text-amber-700 text-md sm:text-base leading-relaxed font-normal"> Dharma</span> (righteousness),
                  <span className="text-orange-600 text-md sm:text-base leading-relaxed font-normal"> Artha</span> (prosperity),
                  <span className="text-amber-700 text-md sm:text-base leading-relaxed font-normal"> Kama</span> (desires), and
                  <span className="text-orange-600 text-md sm:text-base leading-relaxed font-normal"> Moksha</span> (liberation).
                </p>
              </div>

              {/* Card 2: Atman */}
              <div className="relative rounded-xl p-6 border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-md sm:text-base leading-relaxed font-normal">
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity text-md sm:text-base leading-relaxed font-normal">
                  ✨
                </div>
                <h5 className="text-orange-800 text-xl font-semibold leading-snug mb-2">आत्मा - The Eternal Soul</h5>
                <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                  The Atman, your true self, is eternal and divine.
                  <span className="italic text-md sm:text-base leading-relaxed font-normal"> `&quot;`न जायते म्रियते वा`&quot;` </span>
                  — It is never born, nor does it die. Life is the soul&apos;s journey to realize its oneness with Brahman.
                </p>
              </div>

              {/* Card 3: Karma */}
              <div className="relative rounded-xl p-6 border-yellow-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-md sm:text-base leading-relaxed font-normal">
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity text-md sm:text-base leading-relaxed font-normal">
                  ⚖️
                </div>
                <h6 className="text-yellow-800 text-xl font-semibold leading-snug mb-2">कर्म - Law of Action</h6>
                <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                  Every action creates karma, shaping our destiny.
                  <span className="text-amber-700 text-md sm:text-base leading-relaxed font-normal"> `&quot;`कर्मण्येवाधिकारस्ते`&quot;`</span>
                  — You have the right to perform your duty, but the fruits belong to the divine.
                </p>
              </div>

              {/* Card 4: Maya & Reality */}
              <div className="relative rounded-xl p-6 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-md sm:text-base leading-relaxed font-normal">
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity text-md sm:text-base leading-relaxed font-normal">
                  🌌
                </div>
                <h6 className="text-amber-800 text-xl font-semibold leading-snug mb-2">माया - Illusion & Truth</h6>
                <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                  Life is a play of Maya, the cosmic illusion. True wisdom lies in seeing beyond appearances to recognize the
                  <span className="text-orange-600 text-md sm:text-base leading-relaxed font-normal"> eternal truth</span> that pervades all existence.
                </p>
              </div>
            </div>

            {/* Central wisdom quote */}
            <div className="relative text-md sm:text-base leading-relaxed font-normal">
              <div className="absolute inset-0 blur-2xl text-md sm:text-base leading-relaxed font-normal" />
              <div className="relative rounded-2xl p-6 border-amber-300/30 backdrop-blur-sm text-md sm:text-base leading-relaxed font-normal">
                <div className="text-center space-y-4 text-md sm:text-base leading-relaxed font-normal">
                  <p className="text-amber-900 text-md sm:text-base leading-relaxed mb-4 font-normal">
                    `&quot;`आत्मानं विद्धि`&quot;`
                  </p>
                  <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                    Know Thyself
                  </p>
                  <div className="pt-4 border-amber-300/30 text-md sm:text-base leading-relaxed font-normal">
                    <p className="max-w-3xl mx-auto text-md sm:text-base leading-relaxed mb-4 font-normal">
                      Life is the divine opportunity to realize your true nature—not this temporary body,
                      but the immortal consciousness that witnesses all, untouched by birth or death,
                      pleasure or pain. This realization is the highest goal of human existence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Four stages of life */}
            <div className="text-md sm:text-base leading-relaxed font-normal">
              <h6 className="text-center text-amber-800 text-xl font-semibold leading-snug mb-2">
                आश्रम - The Four Stages of Life
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 my-6 text-md sm:text-base leading-relaxed font-normal">
                <div className="w-full md:min-w-1/4 text-center shadow-md p-4 rounded-lg border-amber-200/40 flex-1 text-md sm:text-base leading-relaxed font-normal">
                  <div className="text-md sm:text-base leading-relaxed font-normal">📚</div>
                  <h4 className="font-semibold text-amber-800 mb-1">Brahmacharya</h4>
                  <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">Student Life - Learning & Discipline</p>
                </div>
                <div className="w-full md:min-w-1/4 text-center shadow-md p-4 rounded-lg border-orange-200/40 text-md sm:text-base leading-relaxed font-normal">
                  <div className="text-md sm:text-base leading-relaxed font-normal">🏡</div>
                  <h4 className="font-semibold text-orange-800 mb-1">Grihastha</h4>
                  <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">Householder - Family & Duty</p>
                </div>
                <div className="w-full md:min-w-1/4 text-center shadow-md p-4 rounded-lg border-yellow-200/40 text-md sm:text-base leading-relaxed font-normal">
                  <div className="text-md sm:text-base leading-relaxed font-normal">🌳</div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Vanaprastha</h4>
                  <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">Retirement - Detachment & Reflection</p>
                </div>
                <div className="w-full md:min-w-1/4 text-center shadow-md p-4 rounded-lg border-amber-200/40 text-md sm:text-base leading-relaxed font-normal">
                  <div className="text-md sm:text-base leading-relaxed font-normal">🧘</div>
                  <h4 className="font-semibold text-amber-800 mb-1">Sannyasa</h4>
                  <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">Renunciation - Complete Liberation</p>
                </div>
              </div>
            </div>

            {/* Closing */}
            <div className="text-center pt-6 border-amber-200/30 text-md sm:text-base leading-relaxed font-normal">
              <p className="text-amber-700 text-md sm:text-base leading-relaxed mb-4 font-normal">
                यत् पिण्डे तत् ब्रह्माण्डे
              </p>
              <p className="italic text-md sm:text-base leading-relaxed mb-4 font-normal">
                As is the individual, so is the universe
              </p>
            </div>

            {/* FAQ widget */}
            {about?.faq && (
              <FaqAccordion items={about.faq?.items ? about.faq.items : []} heading={about.faq?.heading} />
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
}
// Content of AboutClient.tsx can be added here, depending on the actual code. This is just a placeholder.
