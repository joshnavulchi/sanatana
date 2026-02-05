"use client";
import React, { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import useLocaleSection from '../hooks/useLocaleSection';
import { parseMaybeObject } from 'lib/parseContent';
import Loader from '@/app/components/loader/loader';
import TextToSpeech from '../components/text-to-speech/TextToSpeech';
import FaqAccordion from '@/app/components/faqaccordion/faqaccordion';

interface Ruler {
  name: string;
  dynasty?: string;
  reign: string;
  notes?: string;
}

interface RegionData {
  description: string;
  rulers: Ruler[];
}

interface Section {
  id: string;
  heading: string;
  summary: string;
  [key: string]: any;
}

interface TimelineState {
  title: string;
  description: string;
  intro?: { summary: string };
  sections?: Section[];
  india?: RegionData;
  persia?: RegionData;
  rome?: RegionData;
  egypt?: RegionData;
  china?: RegionData;
  greece?: RegionData;
  faq?: {
    heading: string;
    qa: Array<{ q: string; a: string }>;
  };
  diagrams?: {
    ascii?: { caption: string; art: string };
    mermaid?: { caption: string; code: string };
  };
}

// Icon mapping for regions
const regionIcons: Record<string, string> = {
  India: '🕉️',
  Persia: '⚜️',
  Rome: '🏛️',
  Egypt: '🔺',
  China: '🐉',
  Greece: '🏺'
};

// Small subcomponent to render regional rulers to avoid repetition
const Region = ({ title, data }: { title: string; data?: RegionData }) => {
  if (!data || !data.rulers || data.rulers.length === 0) return null;
  return (
    <div className="mb-8">
      {/* Region header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl flex items-center justify-center text-2xl shadow-md">
          {regionIcons[title] || '👑'}
        </div>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h4>
      </div>
      
      {data.description && (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 pl-15">{data.description}</p>
      )}
      
      {/* Rulers timeline */}
      <div className="relative pl-8 space-y-4">
        {/* Vertical timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-400" />
        
        {data.rulers.map((ruler: Ruler, i: number) => (
          <div key={i} className="relative group">
            {/* Timeline dot */}
            <div className="absolute -left-5 top-4 w-4 h-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full border-4 border-white dark:border-gray-900 shadow-lg group-hover:scale-125 transition-transform duration-300" />
            
            {/* Ruler card */}
            <div className="
              bg-white dark:bg-gray-800
              border-2 border-amber-100 dark:border-amber-900/30
              hover:border-amber-300 dark:hover:border-amber-700
              rounded-xl
              p-5
              shadow-md hover:shadow-xl
              transition-all duration-300
              transform hover:-translate-y-1
            ">
              <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-xl">👑</span>
                {ruler.name}
              </h5>
              
              <div className="space-y-2 text-sm">
                {ruler.dynasty && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong className="text-amber-800 dark:text-amber-200">Dynasty:</strong> {ruler.dynasty}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300">
                  <strong className="text-amber-800 dark:text-amber-200">Reign:</strong> {ruler.reign}
                </p>
                {ruler.notes && (
                  <p className="text-gray-600 dark:text-gray-400 italic mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {ruler.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HistoricalTimeline() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('historical_timeline');

  // Initialize with empty state to avoid hydration mismatch
  const [timeline, setTimeline] = useState<TimelineState>({ title: '', description: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Locale loading is now handled by context/useLocaleSection
      } catch (e) { }
      if (!mounted) return;

      // Access nested data from historical_timeline namespace
      const data = (ns as any)?.historical_timeline || ns;
      
      const title = data?.title || '';
      const description = data?.description || '';
      const intro = parseMaybeObject(data?.content?.intro) || {};
      const sections = data?.content?.sections || [];
      const india = parseMaybeObject(data?.india) || {};
      const persia = parseMaybeObject(data?.persia) || {};
      const rome = parseMaybeObject(data?.rome) || {};
      const egypt = parseMaybeObject(data?.egypt) || {};
      const china = parseMaybeObject(data?.china) || {};
      const greece = parseMaybeObject(data?.greece) || {};
      const faq = parseMaybeObject(data?.faq) || {};
      const diagrams = parseMaybeObject(data?.diagrams) || {};

      setTimeline({
        title,
        description,
        intro,
        sections,
        india,
        persia,
        rome,
        egypt,
        china,
        greece,
        faq,
        diagrams
      });
    })();
    return () => {
      mounted = false;
    };
  }, [locale, ns]);

  if (isLoading && !timeline.title) {
    return (
      <PageLayout
        metaKey="historical_timeline.meta"
        title=""
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Historical Timeline' }]}
        className="layout-sm"
      >
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="historical_timeline.meta"
      title={timeline.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Historical Timeline' }]}
      className="layout-sm"
    >
      {/* Text-to-Speech Player */}
      <TextToSpeech sectionId="timeline-content" className="floating" />
      <div id="timeline-content" className="space-y-12">
        {/* Hero description */}
        <div className="relative -mt-8 -mx-6 md:-mx-8 px-6 md:px-8 py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500" />
              <span className="text-3xl animate-pulse">⏳</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500" />
            </div>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {timeline.description}
            </p>
          </div>
        </div>

        {/* Introduction */}
        {timeline.intro && (
          <div className="bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800 dark:to-amber-950/20 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 md:p-8 shadow-lg">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{timeline.intro.summary}</p>
          </div>
        )}

        {/* Main Content Sections */}
        {timeline.sections && timeline.sections.length > 0 && (
          <div className="space-y-8">
            {timeline.sections.map((section: Section, idx: number) => (
              <section key={section.id || idx} id={section.id} className="mb-8">
                <h3 className="h3">{section.heading}</h3>
                <p className="mb-4">{section.summary}</p>

                {/* Definitions Section */}
                {section.id === 'definitions' && section.items && (
                  <div className="flex flex-wrap gap-6">
                    {section.items.map((item: any, i: number) => (
                      <div key={i} className="bg-white dark:bg-gray-800 border-l-4 border-amber-500 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start gap-3 mb-4">
                          <span className="text-2xl">📅</span>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{item.term}</h4>
                            <p className="text-sm text-amber-800 dark:text-amber-200 font-semibold">{item.fullForm}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700 dark:text-gray-300"><strong className="text-amber-800 dark:text-amber-200">Time Period:</strong> {item.timePeriod}</p>
                          <p className="text-gray-700 dark:text-gray-300"><strong className="text-amber-800 dark:text-amber-200">Counting Direction:</strong> {item.countingDirection}</p>
                          <p className="text-gray-700 dark:text-gray-300"><strong className="text-amber-800 dark:text-amber-200">Equivalent To:</strong> {item.equivalentTo}</p>
                          {item.examples && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <strong className="text-gray-900 dark:text-white">Examples:</strong>
                              <ul className="list-none space-y-1 mt-2">
                                {item.examples.map((ex: string, j: number) => (
                                  <li key={j} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                    <span className="text-amber-500 mt-1">•</span>
                                    <span className="flex-1">{ex}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {section.notes && (
                      <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">📝</span>
                          <div className="flex-1">
                            <strong className="text-lg text-gray-900 dark:text-white block mb-3">Notes:</strong>
                            <ul className="space-y-2">
                              {section.notes.map((note: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                  <span className="text-amber-500 mt-1">•</span>
                                  <span className="flex-1">{note}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mapping Section */}
                {section.id === 'mapping-bcad' && section.mapping && (
                  <div>
                    <div className="flex gap-4 mb-4">
                      <div className="font-bold flex-1">Old (BC/AD)</div>
                      <div className="font-bold flex-1">New (BCE/CE)</div>
                      {section.mapping.map((map: any, i: number) => (
                        <React.Fragment key={i}>
                          <div>{map.old}</div>
                          <div>{map.new}</div>
                        </React.Fragment>
                      ))}
                    </div>
                    {section.rules && (
                      <div className="mt-4">
                        <strong>Rules:</strong>
                        <ul className="list-disc ml-6">
                          {section.rules.map((rule: string, i: number) => (
                            <li key={i}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Year Zero Section */}
                {section.id === 'year-zero' && (
                  <div>
                    <p className="mb-2"><strong>Exists:</strong> {section.exists ? 'Yes' : 'No'}</p>
                    {section.reason && (
                      <div className="mb-4">
                        <strong>Reason:</strong>
                        <ul className="list-disc ml-6">
                          {section.reason.map((r: string, i: number) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {section.transition && (
                      <p className="mb-2"><strong>Transition:</strong> {section.transition}</p>
                    )}
                    {section.sequenceExample && (
                      <div className="mb-4">
                        <strong>Sequence Example:</strong>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {section.sequenceExample.map((year: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded">
                              {year}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.implications && (
                      <div className="mb-4">
                        <strong>Implications:</strong>
                        <ul className="list-disc ml-6">
                          {section.implications.map((imp: string, i: number) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {section.commonMistakes && (
                      <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
                        <strong>Common Mistakes:</strong>
                        <ul className="list-disc ml-6 mt-2">
                          {section.commonMistakes.map((mistake: string, i: number) => (
                            <li key={i}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Calculations Section */}
                {section.id === 'calculations' && (
                  <div>
                    {section.rules && (
                      <div className="mb-4">
                        <strong>Rules:</strong>
                        <ul className="list-disc ml-6">
                          {section.rules.map((rule: string, i: number) => (
                            <li key={i}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {section.workedExamples && (
                      <div className="mb-4">
                        <strong>Worked Examples:</strong>
                        {section.workedExamples.map((ex: any, i: number) => (
                          <div key={i} className="mb-2 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                            <strong>{ex.label}:</strong> {ex.explanation}
                            <br />
                            <span className="text-primary font-bold">Duration: {ex.years} years</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {section.centuryRules && (
                      <div className="mt-4">
                        <strong>Century Rules:</strong>
                        <ul className="list-disc ml-6">
                          {section.centuryRules.map((rule: string, i: number) => (
                            <li key={i}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Extended Examples Section */}
                {section.id === 'extended-examples' && section.examples && (
                  <div>
                    <div className="space-y-2">
                      {section.examples.map((ex: any, i: number) => (
                        <div key={i} className="flex justify-between p-2 border-b">
                          <span>{ex.label}</span>
                          <span className="font-bold text-primary">{ex.year}</span>
                        </div>
                      ))}
                    </div>
                    {section.note && (
                      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
                        <strong>Note:</strong> {section.note}
                      </div>
                    )}
                  </div>
                )}

                {/* Astronomy vs History Section */}
                {section.id === 'astronomy-vs-history' && (
                  <div className="space-y-4">
                    {section.historySystem && (
                      <div className="p-4 border rounded">
                        <h4>History System: {section.historySystem.label}</h4>
                        <p><strong>Uses Year Zero:</strong> {section.historySystem.usesYearZero ? 'Yes' : 'No'}</p>
                      </div>
                    )}
                    {section.astronomySystem && (
                      <div className="p-4 border rounded">
                        <h4>Astronomy System: {section.astronomySystem.label}</h4>
                        <p><strong>Uses Year Zero:</strong> {section.astronomySystem.usesYearZero ? 'Yes' : 'No'}</p>
                        {section.astronomySystem.mapping && (
                          <div className="mt-2">
                            <strong>Mapping:</strong>
                            <div className="flex gap-2 mt-2">
                              <div className="font-bold flex-1">Astronomical</div>
                              <div className="font-bold flex-1">Historical</div>
                              {section.astronomySystem.mapping.map((m: any, i: number) => (
                                <React.Fragment key={i}>
                                  <div>{m.astronomical}</div>
                                  <div>{m.historical}</div>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {section.note && (
                      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded">
                        <strong>Note:</strong> {section.note}
                      </div>
                    )}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        {/* Diagrams */}
        {timeline.diagrams && timeline.diagrams.ascii && timeline.diagrams.ascii.art && (
          <section className="mb-8">
            <h3>Visual Timeline</h3>
            <div className="mb-6">
              <p className="mb-2"><strong>{timeline.diagrams.ascii.caption}</strong></p>
              <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">
                {timeline.diagrams.ascii.art}
              </pre>
            </div>
          </section>
        )}

        {/* Historical Rulers by Region */}
        {((timeline.india?.rulers && timeline.india.rulers.length > 0) ||
          (timeline.persia?.rulers && timeline.persia.rulers.length > 0) ||
          (timeline.rome?.rulers && timeline.rome.rulers.length > 0) ||
          (timeline.egypt?.rulers && timeline.egypt.rulers.length > 0) ||
          (timeline.china?.rulers && timeline.china.rulers.length > 0) ||
          (timeline.greece?.rulers && timeline.greece.rulers.length > 0)) && (
            <section className="mb-8">
              <h3>Historical Rulers by Region</h3>

              <Region title="India" data={timeline.india} />
              <Region title="Persia" data={timeline.persia} />
              <Region title="Rome" data={timeline.rome} />
              <Region title="Egypt" data={timeline.egypt} />
              <Region title="China" data={timeline.china} />
              <Region title="Greece" data={timeline.greece} />
            </section>
          )}

        {/* FAQ Section */}
        {timeline.faq && timeline.faq.qa && timeline.faq.qa.length > 0 && (
          <FaqAccordion items={timeline.faq.qa} heading={timeline.faq.heading} />
        )}
      </div>
    </PageLayout>
  );
}
