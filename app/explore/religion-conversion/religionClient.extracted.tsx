"use client";

import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
const religion_conversion_page = {
  abrahami_traditio: "Abrahamic Traditions",
  abrahami_traditio_4: "Abrahamic Traditions:",
  allah_islam: "Allah (Islam)",
  brahman: "Brahman:",
  brahman_hinduism: "Brahman (Hinduism)",
  christ_role: "Christ Role:",
  christia: "Christianity",
  christia_3: "Christianity:",
  clarific: "Clarification:",
  compilat: "Compilation:",
  conclusi: "Conclusion",
  cosmolog: "Cosmology:",
  country_wise: "Country-wise Conversion Details",
  critical_academic: "Critical Academic Consensus",
  date: "Date:",
  deity: "Deity:",
  developm: "Development:",
  disclaim: "Disclaimer",
  earliest_text: "Earliest Text:",
  founder: "Founder:",
  god_christia: "God (Christianity)",
  greek_term: "Greek Term:",
  hebrew_bible: "Hebrew Bible:",
  hebrew_root: "Hebrew Root:",
  hinduism: "Hinduism",
  hinduism_1: "Hinduism:",
  historic_jesus: "Historical Jesus:",
  historic_muhammad: "Historical Muhammad:",
  historic_personho: "Historical Personhood:",
  historic_sequence: "Historical Sequence by Textual Evidence",
  incarnat: "Incarnation",
  islam: "Islam",
  islam_2: "Islam:",
  language: "Language:",
  latin_term: "Latin Term:",
  lifetime: "Lifetime:",
  linguist_evolutio: "Linguistic Evolution",
  major_deities: "Major Deities:",
  meaning: "Meaning:",
  metaphys_claims: "Metaphysical Claims:",
  nt_composit: "NT Composition:",
  oldest_survivin: "Oldest Surviving Textual Tradition:",
  ontology: "Ontology",
  origin_claim: "Origin Claim:",
  philosop_differen: "Philosophical Differences",
  pre_islamic: "Pre-Islamic Usage:",
  prophet: "Prophet:",
  quran_revelati: "Quran Revelation:",
  region: "Region:",
  root: "Root:",
  structur: "Structure:",
  textual_historic: "Textual Historical Development",
  textual_level: "Textual Level:",
  theologi_analysis: "Theological Analysis",
  theologi_developm: "Theological Development:",
  theologi_level: "Theological Level:",
  theology: "Theology:",
  time_concept: "Time Concept",
  time_model: "Time Model:",
  upanisha_developm: "Upanishadic Development",
  vedic_traditio: "Vedic Tradition"
};

export default function ReligionClient() {
  const {
    locale,
    isLoading
  } = useLocale();
  const ns = useLocaleSection('religion_conversion');

  // Initialize with empty state to avoid hydration mismatch
  // useLocaleSection will populate the data properly
  const [religion, setReligion] = useState({
    title: '',
    intro: '',
    sections: [] as any[],
    disclaimer: '',
    country_conversion_details: [] as any[]
  });
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Locale loading is now handled by context/useLocaleSection
      } catch (e) {}
      if (!mounted) return;
      const title = String(ns?.title || '');
      const intro = String(ns?.intro || '');
      // Sections can be array or object
      let sections: any[] = [];
      if (Array.isArray(ns?.sections)) {
        sections = ns.sections;
      } else if (typeof ns?.sections === 'object' && ns?.sections !== null) {
        sections = Object.values(ns.sections);
      }
      const disclaimer = String(ns?.disclaimer || '');
      const country_conversion_details = Array.isArray(ns?.country_conversion_details) ? ns.country_conversion_details : [];
      setReligion({
        title,
        intro,
        sections,
        disclaimer,
        country_conversion_details
      });
    })();
    return () => {
      mounted = false;
    };
  }, [locale, ns]);

  // Show loading state if locale is still loading and we have no content
  if (isLoading && !religion.title) {
    return <PageLayout metaKey="religion_conversion" title={religion.title} breadcrumbs={[{
      labelKey: 'Home',
      href: '/'
    }, {
      label: 'Religion Conversion'
    }]} className="layout-md">
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>;
  }
  return <PageLayout metaKey="religion_conversion" title={religion.title} description={religion.intro} titleColor='from-amber-600 via-rose-600 to-indigo-700' breadcrumbs={[{
    labelKey: 'Home',
    href: '/'
  }, {
    label: religion.title
  }]} className="layout-md">
      {/* Theological Analysis Section */}
      {ns?.theological_analysis && <section className="my-12 p-8 rounded-xl shadow-lg bg-gradient-to-br from-indigo-50 to-blue-100 border-l-8 border-indigo-400">
          <h3 className="text-3xl font-extrabold text-indigo-800 mb-4">{religion_conversion_page.theologi_analysis}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl md:text-lg font-bold text-blue-700 mb-2">{religion_conversion_page.hinduism}</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.brahman}</strong> {ns.theological_analysis.hinduism.ultimate_reality}</li>
                <li><strong>{religion_conversion_page.major_deities}</strong> {ns.theological_analysis.hinduism.major_deities.join(', ')}</li>
                <li><strong>{religion_conversion_page.cosmolog}</strong> {ns.theological_analysis.hinduism.cosmology}</li>
                <li><strong>{religion_conversion_page.origin_claim}</strong> {ns.theological_analysis.hinduism.god_origin_claim}</li>
                <li><strong>{religion_conversion_page.time_model}</strong> {ns.theological_analysis.hinduism.time_model}</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl md:text-lg font-bold text-rose-700 mb-2">{religion_conversion_page.christia}</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.deity}</strong> {ns.theological_analysis.christianity.deity}</li>
                <li><strong>{religion_conversion_page.christ_role}</strong> {ns.theological_analysis.christianity.christ_role}</li>
                <li><strong>{religion_conversion_page.origin_claim}</strong> {ns.theological_analysis.christianity.god_origin_claim}</li>
                <li><strong>{religion_conversion_page.time_model}</strong> {ns.theological_analysis.christianity.time_model}</li>
              </ul>
            </div>
            <div>
              <h6 className="text-xl md:text-lg font-bold text-green-700 mb-2">{religion_conversion_page.islam}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.deity}</strong> {ns.theological_analysis.islam.deity}</li>
                <li><strong>{religion_conversion_page.theology}</strong> {ns.theological_analysis.islam.theology}</li>
                <li><strong>{religion_conversion_page.origin_claim}</strong> {ns.theological_analysis.islam.god_origin_claim}</li>
                <li><strong>{religion_conversion_page.time_model}</strong> {ns.theological_analysis.islam.time_model}</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-gray-800 italic text-xl md:text-lg">{ns.theological_analysis.comparative_summary}</div>
        </section>}

      {/* Textual Historical Development Section */}
      {ns?.textual_historical_development && <section className="my-12 p-8 rounded-xl shadow-lg bg-gradient-to-br from-amber-50 to-yellow-100 border-l-8 border-amber-400">
          <h6 className="text-3xl font-extrabold text-amber-800 mb-4">{religion_conversion_page.textual_historic}</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h5 className="text-xl md:text-lg font-bold text-blue-700 mb-2">{religion_conversion_page.vedic_traditio}</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.earliest_text}</strong> {ns.textual_historical_development.vedic_tradition.earliest_text}</li>
                <li><strong>{religion_conversion_page.date}</strong> {ns.textual_historical_development.vedic_tradition.approx_date}</li>
                <li><strong>{religion_conversion_page.region}</strong> {ns.textual_historical_development.vedic_tradition.region}</li>
                <li><strong>{religion_conversion_page.structur}</strong> {ns.textual_historical_development.vedic_tradition.religious_structure}</li>
              </ul>
              <h6 className="text-xl md:text-lg font-bold text-blue-700 mt-4 mb-2">{religion_conversion_page.upanisha_developm}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.date}</strong> {ns.textual_historical_development.upanishadic_development.approx_date}</li>
                <li><strong>{religion_conversion_page.developm}</strong> {ns.textual_historical_development.upanishadic_development.development}</li>
              </ul>
            </div>
            <div>
              <h6 className="text-xl md:text-lg font-bold text-rose-700 mb-2">{religion_conversion_page.christia}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.founder}</strong> {ns.textual_historical_development.christianity.founder}</li>
                <li><strong>{religion_conversion_page.lifetime}</strong> {ns.textual_historical_development.christianity.lifetime}</li>
                <li><strong>{religion_conversion_page.nt_composit}</strong> {ns.textual_historical_development.christianity.new_testament_composition}</li>
                <li><strong>{religion_conversion_page.theologi_developm}</strong> {ns.textual_historical_development.christianity.theological_development}</li>
              </ul>
              <h6 className="text-xl md:text-lg font-bold text-green-700 mt-4 mb-2">{religion_conversion_page.abrahami_traditio}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.hebrew_bible}</strong> {ns.textual_historical_development.hebrew_bible_tradition.development}</li>
                <li><strong>{religion_conversion_page.date}</strong> {ns.textual_historical_development.hebrew_bible_tradition.approx_date}</li>
                <li><strong>{religion_conversion_page.region}</strong> {ns.textual_historical_development.hebrew_bible_tradition.region}</li>
              </ul>
              <h6 className="text-xl md:text-lg font-bold text-green-700 mt-4 mb-2">{religion_conversion_page.islam}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.prophet}</strong> {ns.textual_historical_development.islam.prophet}</li>
                <li><strong>{religion_conversion_page.lifetime}</strong> {ns.textual_historical_development.islam.lifetime}</li>
                <li><strong>{religion_conversion_page.quran_revelati}</strong> {ns.textual_historical_development.islam.quran_revelation}</li>
                <li><strong>{religion_conversion_page.compilat}</strong> {ns.textual_historical_development.islam.compilation_standardization}</li>
              </ul>
            </div>
          </div>
        </section>}

      {/* Linguistic Evolution Section */}
      {ns?.linguistic_evolution && <section className="my-12 p-8 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-rose-100 border-l-8 border-blue-400">
          <h3 className="text-3xl font-extrabold text-blue-800 mb-4">{religion_conversion_page.linguist_evolutio}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="text-xl md:text-lg font-bold text-green-700 mb-2">{religion_conversion_page.brahman_hinduism}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.language}</strong> {ns.linguistic_evolution.brahman.language}</li>
                <li><strong>{religion_conversion_page.meaning}</strong> {ns.linguistic_evolution.brahman.meaning}</li>
              </ul>
            </div>
            <div>
              <h6 className="text-xl md:text-lg font-bold text-rose-700 mb-2">{religion_conversion_page.god_christia}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.hebrew_root}</strong> {ns.linguistic_evolution.god_in_christianity.hebrew_root}</li>
                <li><strong>{religion_conversion_page.greek_term}</strong> {ns.linguistic_evolution.god_in_christianity.greek_term}</li>
                <li><strong>{religion_conversion_page.latin_term}</strong> {ns.linguistic_evolution.god_in_christianity.latin_term}</li>
              </ul>
            </div>
            <div>
              <h6 className="text-xl md:text-lg font-bold text-blue-700 mb-2">{religion_conversion_page.allah_islam}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.root}</strong> {ns.linguistic_evolution.allah.root}</li>
                <li><strong>{religion_conversion_page.language}</strong> {ns.linguistic_evolution.allah.language}</li>
                <li><strong>{religion_conversion_page.pre_islamic}</strong> {ns.linguistic_evolution.allah.pre_islamic_usage}</li>
              </ul>
            </div>
          </div>
        </section>}

      {/* Historical Sequence by Textual Evidence Section */}
      {ns?.historical_sequence_by_textual_evidence && <section className="my-12 p-8 rounded-xl shadow-lg bg-gradient-to-br from-green-50 to-amber-100 border-l-8 border-green-400">
          <h3 className="text-3xl font-extrabold text-green-800 mb-4">{religion_conversion_page.historic_sequence}</h3>
          <ol className="list-decimal pl-8 text-gray-700 space-y-2">
            {ns.historical_sequence_by_textual_evidence.map((item: any, idx: number) => <li key={idx}><strong>{item.tradition}:</strong> {item.date}</li>)}
          </ol>
        </section>}

      {/* Philosophical Differences Section */}
      {ns?.philosophical_differences && <section className="my-12 p-8 rounded-xl shadow-lg bg-gradient-to-br from-rose-50 to-blue-100 border-l-8 border-rose-400">
          <h3 className="text-3xl font-extrabold text-rose-800 mb-4">{religion_conversion_page.philosop_differen}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="text-xl md:text-lg font-bold text-blue-700 mb-2">{religion_conversion_page.ontology}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.hinduism_1}</strong> {ns.philosophical_differences.ontology.hinduism}</li>
                <li><strong>{religion_conversion_page.islam_2}</strong> {ns.philosophical_differences.ontology.islam}</li>
                <li><strong>{religion_conversion_page.christia_3}</strong> {ns.philosophical_differences.ontology.christianity}</li>
              </ul>
            </div>
            <div>
              <h6 className="text-xl md:text-lg font-bold text-green-700 mb-2">{religion_conversion_page.incarnat}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.hinduism_1}</strong> {ns.philosophical_differences.incarnation.hinduism}</li>
                <li><strong>{religion_conversion_page.islam_2}</strong> {ns.philosophical_differences.incarnation.islam}</li>
                <li><strong>{religion_conversion_page.christia_3}</strong> {ns.philosophical_differences.incarnation.christianity}</li>
              </ul>
            </div>
            <div>
              <h6 className="text-xl md:text-lg font-bold text-rose-700 mb-2">{religion_conversion_page.time_concept}</h6>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>{religion_conversion_page.hinduism_1}</strong> {ns.philosophical_differences.time_concept.hinduism}</li>
                <li><strong>{religion_conversion_page.abrahami_traditio_4}</strong> {ns.philosophical_differences.time_concept.abrahamic_traditions}</li>
              </ul>
            </div>
          </div>
        </section>}

      {/* Critical Academic Consensus Section */}
      {ns?.critical_academic_consensus && <section className="my-12 p-8 rounded-xl shadow-lg bg-gradient-to-br from-yellow-50 to-amber-100 border-l-8 border-yellow-400">
          <h3 className="text-3xl font-extrabold text-yellow-800 mb-4">{religion_conversion_page.critical_academic}</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>{religion_conversion_page.oldest_survivin}</strong> {ns.critical_academic_consensus.oldest_surviving_textual_tradition}</li>
            <li><strong>{religion_conversion_page.historic_jesus}</strong> {ns.critical_academic_consensus.historical_jesus}</li>
            <li><strong>{religion_conversion_page.historic_muhammad}</strong> {ns.critical_academic_consensus.historical_muhammad}</li>
            <li><strong>{religion_conversion_page.metaphys_claims}</strong> {ns.critical_academic_consensus.metaphysical_claims}</li>
          </ul>
        </section>}

      {/* Conclusion Section */}
      {ns?.conclusion && <section className="my-12 p-8 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-amber-100 border-l-8 border-blue-400">
          <h3 className="text-3xl font-extrabold text-blue-800 mb-4">{religion_conversion_page.conclusi}</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>{religion_conversion_page.theologi_level}</strong> {ns.conclusion.theological_level}</li>
            <li><strong>{religion_conversion_page.textual_level}</strong> {ns.conclusion.textual_level}</li>
            <li><strong>{religion_conversion_page.historic_personho}</strong> {ns.conclusion.historical_personhood}</li>
            <li><strong>{religion_conversion_page.clarific}</strong> {ns.conclusion.clarification}</li>
          </ul>
        </section>}

      {religion.sections.map((section: any, idx: number) => <div key={idx} className="mb-10">
          <h6 className="text-2xl font-bold text-blue-800 mb-3 border-l-4 border-blue-400 pl-3">{section.title}</h6>
          {/* Section content: string */}
          {typeof section.content === 'string' && <p className="text-gray-700 mb-2 text-base md:text-md leading-relaxed">{section.content}</p>}
          {/* Section content: array of strings */}
          {Array.isArray(section.content) && section.content.length > 0 && typeof section.content[0] === 'string' && <ul className="list-disc pl-8 text-gray-700 space-y-2">
              {section.content.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>}
          {/* Section content: array of objects (country details) */}
          {Array.isArray(section.content) && section.content.length > 0 && typeof section.content[0] === 'object' && <div className="grid grid-cols-1 gap-4 mt-4">
              {section.content.map((item: any, i: number) => <div key={i} className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-400 rounded-lg p-4 shadow">
                  <div className="font-semibold text-blue-700 text-xl md:text-lg mb-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                    {item.country}
                  </div>
                  <div className="text-gray-700 text-base md:text-md">{item.details}</div>
                </div>)}
            </div>}
        </div>)}

      {/* Unique country-wise conversion section */}
      {religion.country_conversion_details && religion.country_conversion_details.length > 0 && <div className="mt-12">
          <h6 className="text-2xl font-bold text-green-800 mb-4 border-l-4 border-green-400 pl-3">{religion_conversion_page.country_wise}</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {religion.country_conversion_details.map((item, idx) => <div key={idx} className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-400 rounded-lg p-4 shadow hover:scale-105 transition-transform duration-200">
                <div className="font-semibold text-green-700 text-xl md:text-lg mb-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  {item.country}
                </div>
                <div className="text-gray-700 text-xl md:text-lg">{item.details}</div>
              </div>)}
          </div>
        </div>}

      {/* Disclaimer section */}
      {religion.disclaimer && <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 mt-12">
          <div className="flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h6 className="text-xl md:text-lg font-bold text-yellow-800 mb-2">{religion_conversion_page.disclaim}</h6>
              <p className="text-gray-700">{religion.disclaimer}</p>
            </div>
          </div>
        </div>}
    </PageLayout>;
}