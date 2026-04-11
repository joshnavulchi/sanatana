"use client";

import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import PageLayout from '@components/common/PageLayout';
import FaqAccordion from '../components/faqaccordion';
import LazyImage from '../components/lazyimage';

export default function DripIrrigationProcessClient() {
  const isVisible = true;
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('drip-irrigation-process');

  // Compute dripIrrigationProcess object directly from ns
  const dripIrrigationProcess = {
    title: String(ns?.title || ''),
    description: String(ns?.description || ''),
    discription: String(ns?.discription || ''),
    hero: ns?.hero || {},
    diagram: ns?.diagram || {},
    cta: ns?.cta || {},
    revolutions: Array.isArray(ns?.revolutions) ? ns.revolutions : [],
    sections: Array.isArray(ns?.sections) ? ns.sections : [],
    technologies: Array.isArray(ns?.technologies) ? ns.technologies : [],
    faq: ns?.faq || {}
  };

  // Show loading state if locale is still loading and we have no content
  if (isLoading && !dripIrrigationProcess.title) {
    return (
      <PageLayout
        metaKey="drip-irrigation-process"
        title={dripIrrigationProcess?.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: dripIrrigationProcess.title }]}
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
        metaKey="drip-irrigation-process"
        title={dripIrrigationProcess.title}
        description={dripIrrigationProcess.description || dripIrrigationProcess.discription || ''}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: dripIrrigationProcess.title }]}
        className="layout-md"
      >

        <div className='space-y-8'>

          {/* Hero Section */}
          {dripIrrigationProcess.hero && Object.keys(dripIrrigationProcess.hero).length > 0 && (
            <div className="relative bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  {dripIrrigationProcess.hero.badge}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  {dripIrrigationProcess.hero.title}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {dripIrrigationProcess.hero.subtitle}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {dripIrrigationProcess.discription && (
            <div className="text-md sm:text-base leading-relaxed font-normal">
              <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                {dripIrrigationProcess.discription}
              </p>
            </div>
          )}

          {/* Diagram */}
          <LazyImage src="/images/drip-irrigation-process.png" alt={dripIrrigationProcess.diagram?.alt || 'Diagram'} width={1200} height={800} className="w-full max-w-4xl mx-auto" />
          {dripIrrigationProcess.diagram && dripIrrigationProcess.diagram.lines && (
            <div className="relative bg-gray-50 rounded-2xl p-6 md:p-8 shadow-md">
              <h3 className="text-2xl text-gray-900 mb-6">{dripIrrigationProcess.diagram.title}</h3>
              <div className="space-y-2 font-mono text-sm bg-white p-4 rounded-lg border">
                {dripIrrigationProcess.diagram.lines.map((line: string, index: number) => (
                  <div key={index} className="text-gray-700">{line}</div>
                ))}
              </div>
            </div>
          )}

          {/* Sections as cards */}
          {dripIrrigationProcess.sections.map((section: any, index: number) => {
            const level = Math.min(index + 2, 6);
            const Tag = `h${level}` as unknown as React.ElementType;

            // Icon mapping for different section types
            const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨', '🔧', '📊', '🌱', '💧'];
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

                  {/* Section paragraphs */}
                  {section.paragraphs && section.paragraphs.map((paragraph: string, idx: number) => (
                    <p key={idx} className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                      {paragraph}
                    </p>
                  ))}

                  {/* Section bullets */}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-3 list-disc pl-5 text-md sm:text-base leading-relaxed">
                      {section.bullets.map((bullet: string, idx: number) => (
                        <li key={idx} className="relative flex items-start gap-3 mb-2">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full text-md sm:text-base leading-relaxed font-normal" />
                          <span className="flex-1 text-md sm:text-base leading-relaxed font-normal">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Section steps */}
                  {section.steps && section.steps.length > 0 && (
                    <div className="space-y-4">
                      {section.steps.map((step: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-blue-200 pl-4">
                          <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            {step.icon && <span>{step.icon}</span>}
                            {step.title || step.step}
                          </h5>
                          <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">{step.details}</p>
                          {step.details && Array.isArray(step.details) && (
                            <ul className="space-y-2 ml-4">
                              {step.details.map((detail: string, dIdx: number) => (
                                <li key={dIdx} className="text-md sm:text-base leading-relaxed font-normal">• {detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section items */}
                  {section.items && section.items.length > 0 && (
                    <div className="space-y-4">
                      {section.items.map((item: any, idx: number) => (
                        <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                          <h5 className="font-semibold text-gray-900 mb-2">{item.name}</h5>
                          <p className="text-md sm:text-base leading-relaxed mb-2 font-normal"><strong>Function:</strong> {item.function}</p>
                          <p className="text-md sm:text-base leading-relaxed font-normal"><strong>Sizing Notes:</strong> {item.sizingNotes}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulae */}
                  {section.formulae && section.formulae.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Formulae</h4>
                      {section.formulae.map((formula: any, idx: number) => (
                        <div key={idx} className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">{formula.name}</h5>
                          <div className="font-mono text-sm bg-white p-2 rounded border mb-2">
                            {formula.expr}
                          </div>
                          {formula.variables && (
                            <p className="text-sm text-gray-600 mb-2"><strong>Variables:</strong> {formula.variables}</p>
                          )}
                          {formula.units && (
                            <p className="text-sm text-gray-600 mb-2"><strong>Units:</strong> {formula.units}</p>
                          )}
                          {formula.note && (
                            <p className="text-sm text-gray-600 mb-2"><strong>Note:</strong> {formula.note}</p>
                          )}
                          {formula.example && (
                            <p className="text-sm text-gray-600"><strong>Example:</strong> {formula.example}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Worked Example */}
                  {section.workedExample && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="text-xl font-semibold text-green-800 mb-4">{section.workedExample.title}</h4>
                      {section.workedExample.given && (
                        <div className="mb-4">
                          <h5 className="font-semibold text-green-700 mb-2">Given:</h5>
                          <ul className="space-y-1">
                            {section.workedExample.given.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {section.workedExample.calc && (
                        <div>
                          <h5 className="font-semibold text-green-700 mb-2">Calculation:</h5>
                          <ul className="space-y-1">
                            {section.workedExample.calc.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {section.notes && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-2">Notes</h4>
                      <p className="text-md sm:text-base leading-relaxed font-normal">{section.notes}</p>
                    </div>
                  )}

                  {/* FAQ items within section */}
                  {section.items && section.title === 'FAQ' && (
                    <div className="space-y-4">
                      {section.items.map((item: any, idx: number) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <h5 className="font-semibold text-gray-900 mb-2">{item.q}</h5>
                          <p className="text-md sm:text-base leading-relaxed font-normal">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* CTA Section */}
          {dripIrrigationProcess.cta && Object.keys(dripIrrigationProcess.cta).length > 0 && (
            <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">{dripIrrigationProcess.cta.title}</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{dripIrrigationProcess.cta.body}</p>
                {dripIrrigationProcess.cta.button && (
                  <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    {dripIrrigationProcess.cta.button.label}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FAQ widget */}
        {dripIrrigationProcess?.faq && dripIrrigationProcess.faq.items && (
          <FaqAccordion items={dripIrrigationProcess.faq.items} heading={dripIrrigationProcess.faq.heading || 'FAQ'} />
        )}
      </PageLayout>
    </>
  );
}