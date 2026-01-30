"use client";
import React, { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import { loadLocale, getLocaleObject } from 'lib/i18n';
import { useT } from '../hooks/useT';
import { parseSections, parseMaybeObject } from 'lib/parseContent';
import Loader from '@components/loader/loader';
import TextToSpeech from '../components/text-to-speech/TextToSpeech';
import FaqAccordion from '@components/faqaccordion/faqaccordion';

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

export default function HistoricalTimeline() {
  const { locale, isLoading } = useLocale();
  const t = useT();

  // Initialize with current data to prevent empty renders on refresh
  const getInitialTimeline = (): TimelineState => {
    try {
      const localeObj = getLocaleObject(locale) as any;
      if (!localeObj || Object.keys(localeObj).length === 0) {
        return { title: '', description: '' };
      }
      const timeline = localeObj?.historical_timeline || {};
      return {
        title: timeline.title || '',
        description: timeline.description || '',
        intro: timeline.content?.intro || {},
        sections: timeline.content?.sections || [],
        india: timeline.india || {},
        persia: timeline.persia || {},
        rome: timeline.rome || {},
        egypt: timeline.egypt || {},
        china: timeline.china || {},
        greece: timeline.greece || {},
        faq: timeline.faq || {},
        diagrams: timeline.diagrams || {}
      };
    } catch (e) {
      return { title: '', description: '' };
    }
  };

  const [timeline, setTimeline] = useState<TimelineState>(getInitialTimeline);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await loadLocale(locale).catch(() => {});
      } catch (e) {}
      if (!mounted) return;

      const title = t('historical_timeline.title') || '';
      const description = t('historical_timeline.description') || '';
      const intro = parseMaybeObject(t('historical_timeline.content.intro'));
      const sections = t('historical_timeline.content.sections') || [];
      const india = parseMaybeObject(t('historical_timeline.india')) || {};
      const persia = parseMaybeObject(t('historical_timeline.persia')) || {};
      const rome = parseMaybeObject(t('historical_timeline.rome')) || {};
      const egypt = parseMaybeObject(t('historical_timeline.egypt')) || {};
      const china = parseMaybeObject(t('historical_timeline.china')) || {};
      const greece = parseMaybeObject(t('historical_timeline.greece')) || {};
      const faq = parseMaybeObject(t('historical_timeline.faq')) || {};
      const diagrams = parseMaybeObject(t('historical_timeline.diagrams')) || {};

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
  }, [locale, t]);

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
      <div id="timeline-content">
        <p className="lead">{timeline.description}</p>

        {/* Introduction */}
        {timeline.intro && (
          <section className="mb-8">
            <p>{timeline.intro.summary}</p>
          </section>
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
                  <div className="space-y-6">
                    {section.items.map((item: any, i: number) => (
                      <div key={i} className="border-l-4 border-primary pl-4">
                        <h4>{item.term} - {item.fullForm}</h4>
                        <p><strong>Time Period:</strong> {item.timePeriod}</p>
                        <p><strong>Counting Direction:</strong> {item.countingDirection}</p>
                        <p><strong>Equivalent To:</strong> {item.equivalentTo}</p>
                        {item.examples && (
                          <div className="mt-2">
                            <strong>Examples:</strong>
                            <ul className="list-disc ml-6">
                              {item.examples.map((ex: string, j: number) => (
                                <li key={j}>{ex}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                    {section.notes && (
                      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
                        <strong>Notes:</strong>
                        <ul className="list-disc ml-6 mt-2">
                          {section.notes.map((note: string, i: number) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Mapping Section */}
                {section.id === 'mapping-bcad' && section.mapping && (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="font-bold">Old (BC/AD)</div>
                      <div className="font-bold">New (BCE/CE)</div>
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
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="font-bold">Astronomical</div>
                              <div className="font-bold">Historical</div>
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

          {timeline.india && timeline.india.rulers && timeline.india.rulers.length > 0 && (
            <div className="mb-6">
              <h4>India</h4>
              <p className="mb-4">{timeline.india.description}</p>
              <div className="space-y-3">
                {timeline.india.rulers.map((ruler: Ruler, i: number) => (
                  <div key={i} className="p-4 border rounded">
                    <h5>{ruler.name}</h5>
                    {ruler.dynasty && <p className="text-sm"><strong>Dynasty:</strong> {ruler.dynasty}</p>}
                    <p className="text-sm"><strong>Reign:</strong> {ruler.reign}</p>
                    {ruler.notes && <p className="text-sm italic">{ruler.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {timeline.persia && timeline.persia.rulers && timeline.persia.rulers.length > 0 && (
            <div className="mb-6">
              <h4>Persia</h4>
              <p className="mb-4">{timeline.persia.description}</p>
              <div className="space-y-3">
                {timeline.persia.rulers.map((ruler: Ruler, i: number) => (
                  <div key={i} className="p-4 border rounded">
                    <h5>{ruler.name}</h5>
                    <p className="text-sm"><strong>Reign:</strong> {ruler.reign}</p>
                    {ruler.notes && <p className="text-sm italic">{ruler.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {timeline.rome && timeline.rome.rulers && timeline.rome.rulers.length > 0 && (
            <div className="mb-6">
              <h4>Rome</h4>
              <p className="mb-4">{timeline.rome.description}</p>
              <div className="space-y-3">
                {timeline.rome.rulers.map((ruler: Ruler, i: number) => (
                  <div key={i} className="p-4 border rounded">
                    <h5>{ruler.name}</h5>
                    <p className="text-sm"><strong>Reign:</strong> {ruler.reign}</p>
                    {ruler.notes && <p className="text-sm italic">{ruler.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {timeline.egypt && timeline.egypt.rulers && timeline.egypt.rulers.length > 0 && (
            <div className="mb-6">
              <h4>Egypt</h4>
              <p className="mb-4">{timeline.egypt.description}</p>
              <div className="space-y-3">
                {timeline.egypt.rulers.map((ruler: Ruler, i: number) => (
                  <div key={i} className="p-4 border rounded">
                    <h5>{ruler.name}</h5>
                    <p className="text-sm"><strong>Reign:</strong> {ruler.reign}</p>
                    {ruler.notes && <p className="text-sm italic">{ruler.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {timeline.china && timeline.china.rulers && timeline.china.rulers.length > 0 && (
            <div className="mb-6">
              <h4>China</h4>
              <p className="mb-4">{timeline.china.description}</p>
              <div className="space-y-3">
                {timeline.china.rulers.map((ruler: Ruler, i: number) => (
                  <div key={i} className="p-4 border rounded">
                    <h5>{ruler.name}</h5>
                    <p className="text-sm"><strong>Reign:</strong> {ruler.reign}</p>
                    {ruler.notes && <p className="text-sm italic">{ruler.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {timeline.greece && timeline.greece.rulers && timeline.greece.rulers.length > 0 && (
            <div className="mb-6">
              <h4>Greece</h4>
              <p className="mb-4">{timeline.greece.description}</p>
              <div className="space-y-3">
                {timeline.greece.rulers.map((ruler: Ruler, i: number) => (
                  <div key={i} className="p-4 border rounded">
                    <h4 className="h5">{ruler.name}</h4>
                    <p className="text-sm"><strong>Reign:</strong> {ruler.reign}</p>
                    {ruler.notes && <p className="text-sm italic">{ruler.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
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
