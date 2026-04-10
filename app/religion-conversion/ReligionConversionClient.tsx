"use client";

import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import TextToSpeech from '@/app/components/TextToSpeech';
import PageLayout from '@components/common/PageLayout';
import { parseMaybeObject } from '@/lib/parse';
import FaqAccordion from '../components/faqaccordion';

export default function ReligionConversionClient() {
  const isVisible = true;
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('religion-conversion');

  // Compute religionConversion object directly from ns
  const religionConversion = {
    title: String(ns?.title || ''),
    description: String(ns?.description || ''),
    descriptions: String(ns?.descriptions || ''),
    conclusion: ns?.conclusion || {},
    country_conversion_details: Array.isArray(ns?.country_conversion_details) ? ns.country_conversion_details : [],
    critical_academic_consensus: ns?.critical_academic_consensus || {},
    historical_sequence_by_textual_evidence: Array.isArray(ns?.historical_sequence_by_textual_evidence) ? ns.historical_sequence_by_textual_evidence : [],
    linguistic_evolution: ns?.linguistic_evolution || {},
    methodology: ns?.methodology || {},
    philosophical_differences: ns?.philosophical_differences || {},
    religion_expansion: Array.isArray(ns?.religion_expansion) ? ns.religion_expansion : [],
    religion_population_by_century: Array.isArray(ns?.religion_population_by_century) ? ns.religion_population_by_century : [],
    religion_spread_by_country: ns?.religion_spread_by_country || {},
    supported_religions_total: ns?.supported_religions_total || 0,
    textual_historical_development: ns?.textual_historical_development || {},
    theological_analysis: ns?.theological_analysis || {},
    topic: String(ns?.topic || ''),
    sections: Array.isArray(ns?.sections) ? ns.sections : [],
    disclaimer: String(ns?.disclaimer || ''),
    faq: parseMaybeObject(ns?.faq || '')
  };

  // Show loading state if locale is still loading and we have no content
  if (isLoading && !religionConversion.title) {
    return (
      <PageLayout
        metaKey="religion-conversion"
        title={religionConversion?.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: religionConversion.title }]}
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
        metaKey="religion-conversion"
        title={religionConversion.title}
        description={religionConversion.description || ''}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: religionConversion.title }]}
        className="layout-md"
      >
        {/* Text-to-Speech Player */}
        <TextToSpeech sectionId="religionConversion-content" className="floating" />

        <div id="religionConversion-content" className='space-y-8'>

          {/* Descriptions */}
          {religionConversion.descriptions && (
            <div className="text-md sm:text-base leading-relaxed font-normal">
              <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                {religionConversion.descriptions}
              </p>
            </div>
          )}

          {/* Sections as cards */}
          {religionConversion.sections.map((section: any, index: number) => {
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
                  {typeof section.content === 'string' && section.content && (
                    <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                      {section.content.split('\n\n').map((paragraph: string, idx: number) => (
                        <span key={idx}>
                          {paragraph}
                          {idx < section.content.split('\n\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  )}

                  {/* Section content as array */}
                  {Array.isArray(section.content) && section.content.length > 0 && (
                    <div className="space-y-4">
                      {section.content.map((item: any, idx: number) => {
                        if (typeof item === 'string') {
                          return (
                            <li key={idx} className="relative flex items-start gap-3 mb-2">
                              <span className="flex-shrink-0 w-2 h-2 rounded-full text-md sm:text-base leading-relaxed font-normal" />
                              <span className="flex-1 text-md sm:text-base leading-relaxed font-normal">{item}</span>
                            </li>
                          );
                        } else if (item.country && item.details) {
                          return (
                            <div key={idx} className="border-l-4 border-amber-200 pl-4 mb-4">
                              <h5 className="font-semibold text-amber-800 mb-2">{item.country}</h5>
                              <p className="text-md sm:text-base leading-relaxed font-normal">{item.details}</p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
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

          {/* Country Conversion Details */}
          {religionConversion.country_conversion_details.length > 0 && (
            <div className="relative bg-white rounded-2xl p-4 md:p-8 shadow-md">
              <h3 className="text-2xl text-gray-900 mb-6">Country-wise Conversion Trends and Facts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {religionConversion.country_conversion_details.map((country: any, index: number) => (
                  <div key={index} className="border-l-4 border-amber-200 pl-4">
                    <h4 className="font-semibold text-amber-800 mb-2">{country.country}</h4>
                    <p className="text-md sm:text-base leading-relaxed font-normal">{country.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Sequence */}
          {religionConversion.historical_sequence_by_textual_evidence.length > 0 && (
            <div className="relative bg-white rounded-2xl p-4 md:p-8 shadow-md">
              <h3 className="text-2xl text-gray-900 mb-6">Historical Sequence by Textual Evidence</h3>
              <div className="space-y-4">
                {religionConversion.historical_sequence_by_textual_evidence.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center font-semibold text-amber-800">
                      {item.date}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.tradition}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Religion Expansion */}
          {religionConversion.religion_expansion.length > 0 && (
            <div className="relative bg-white rounded-2xl p-4 md:p-8 shadow-md">
              <h3 className="text-2xl text-gray-900 mb-6">Religion Expansion History</h3>
              <div className="space-y-6">
                {religionConversion.religion_expansion.map((religion: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="text-xl font-semibold text-amber-800 mb-4">{religion.religion}</h4>
                    <p className="mb-4"><strong>Founder:</strong> {religion.founder}</p>
                    <p className="mb-4"><strong>Origin:</strong> {religion.origin_region}, {religion.origin_year}</p>
                    <div className="space-y-2">
                      <h5 className="font-semibold">Expansion Map:</h5>
                      {religion.expansion_map.map((period: any, idx: number) => (
                        <div key={idx} className="ml-4">
                          <strong>{period.period}:</strong> {period.regions.join(', ')}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Religion Population by Century */}
          {religionConversion.religion_population_by_century.length > 0 && (
            <div className="relative bg-white rounded-2xl p-4 md:p-8 shadow-md">
              <h3 className="text-2xl text-gray-900 mb-6">Global Religion History</h3>
              <div className="space-y-4">
                {religionConversion.religion_population_by_century.map((century: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="text-xl font-semibold text-amber-800 mb-4">{century.century}</h4>
                    <p className="mb-2"><strong>World Population:</strong> {century.world_population_millions} million</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(century.religions).map(([religion, count]: [string, any]) => (
                        <div key={religion} className="text-center">
                          <div className="font-semibold">{religion}</div>
                          <div className="text-amber-600">{count} million</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conclusion */}
          {religionConversion.conclusion && Object.keys(religionConversion.conclusion).length > 0 && (
            <div className="relative bg-amber-50 rounded-2xl p-4 md:p-8 shadow-md">
              <h3 className="text-2xl text-gray-900 mb-6">Conclusion</h3>
              <div className="space-y-4">
                {religionConversion.conclusion.clarification && (
                  <p className="text-md sm:text-base leading-relaxed font-normal">
                    <strong>Clarification:</strong> {religionConversion.conclusion.clarification}
                  </p>
                )}
                {religionConversion.conclusion.historical_personhood && (
                  <p className="text-md sm:text-base leading-relaxed font-normal">
                    <strong>Historical Personhood:</strong> {religionConversion.conclusion.historical_personhood}
                  </p>
                )}
                {religionConversion.conclusion.textual_level && (
                  <p className="text-md sm:text-base leading-relaxed font-normal">
                    <strong>Textual Level:</strong> {religionConversion.conclusion.textual_level}
                  </p>
                )}
                {religionConversion.conclusion.theological_level && (
                  <p className="text-md sm:text-base leading-relaxed font-normal">
                    <strong>Theological Level:</strong> {religionConversion.conclusion.theological_level}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Critical Academic Consensus */}
          {religionConversion.critical_academic_consensus && Object.keys(religionConversion.critical_academic_consensus).length > 0 && (
            <div className="relative bg-white rounded-2xl p-4 md:p-8 shadow-md">
              <h3 className="text-2xl text-gray-900 mb-6">Critical Academic Consensus</h3>
              <div className="space-y-4">
                {Object.entries(religionConversion.critical_academic_consensus).map(([key, value]: [string, any]) => (
                  <p key={key} className="text-md sm:text-base leading-relaxed font-normal">
                    <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer section */}
          {religionConversion.disclaimer && (
            <div className="relative rounded-lg p-4 md:p-8 shadow-lg text-md sm:text-base leading-relaxed font-normal">
              <div className="flex items-start gap-4 text-md sm:text-base leading-relaxed font-normal">
                <span className="text-md sm:text-base leading-relaxed font-normal">⚠️</span>
                <div className="flex-1 text-md sm:text-base leading-relaxed font-normal">
                  <h4 className="text-xl md:text-md sm:text-base font-semibold text-gray-900 mb-2">Disclaimer</h4>
                  <p className="text-md sm:text-base leading-relaxed mb-4 font-normal">
                    {religionConversion.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQ widget */}
        {religionConversion?.faq && (
          <FaqAccordion items={religionConversion.faq?.items ? religionConversion.faq.items : []} heading={religionConversion.faq?.heading} />
        )}
      </PageLayout>
    </>
  );
}
// Content of religionConversionClient.tsx can be added here, depending on the actual code. This is just a placeholder.
