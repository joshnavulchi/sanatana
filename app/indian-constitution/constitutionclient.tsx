
"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';

export default function ConstitutionClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('indian_constitute');
  const [constitution, setConstitution] = useState({ title: '', meta: {}, overview: {}, sections: [] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const title = String(ns?.indian_constition?.title || '');
      const meta = ns?.indian_constition?.meta || {};
      const overview = ns?.indian_constition?.overview || {};
      const sections = Array.isArray(ns?.indian_constition?.sections) ? ns.indian_constition.sections : [];
      setConstitution({ title, meta, overview, sections });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !constitution.title) {
    return (
      <PageLayout
        metaKey="indian_constitute"
        title=""
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Constitution' }]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        metaKey="indian_constitute"
        title={constitution.title}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Constitution' }]}
        className="layout-md"
      >
        <div id="constitution-content">
          {/* Hero intro section */}
          <div className="relative px-4 md:px-10 py-14 md:py-20 bg-gradient-to-br from-blue-100 via-cyan-50 to-white rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-200">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-300/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 w-2/3 h-2/3 bg-gradient-to-br from-blue-200/30 via-cyan-100/20 to-white/0 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8 justify-center">
                <div className="h-1 w-16 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-200 rounded-full" />
                <span className="text-4xl animate-bounce drop-shadow-lg">📜</span>
                <div className="h-1 w-16 bg-gradient-to-l from-blue-400 via-cyan-400 to-blue-200 rounded-full" />
              </div>
              <p className="text-xl md:text-lg md:text-2xl font-semibold leading-relaxed text-blue-900 drop-shadow-sm max-w-3xl mx-auto">
                {constitution.meta && (constitution.meta as any).description}
              </p>
            </div>
          </div>

          {/* Sections as cards */}
          {constitution.sections.map((section: any, index: number) => {
            const level = Math.min(index + 2, 6);
            const Tag = `h${level}` as unknown as React.ElementType;
            const icons = ['📖', '🎯', '💡', '🌟', '🔮', '✨'];
            const icon = icons[index % icons.length];
            return (
              <div
                key={section.id || index}
                className="relative bg-white border-4 border-blue-200 rounded-3xl p-8 md:p-12 mt-16 shadow-2xl hover:shadow-blue-300/60 transition-all duration-500 group overflow-visible"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-300/20 to-transparent rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-300/20 to-transparent rounded-bl-3xl" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-200 rounded-full opacity-70" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-200 to-cyan-100 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 border-2 border-blue-300">
                      {icon}
                    </div>
                    <Tag className="flex-1 text-3xl md:text-4xl font-extrabold text-blue-900 group-hover:text-cyan-700 tracking-tight transition-colors duration-300 drop-shadow-md">
                      {section.title}
                    </Tag>
                  </div>
                  {/* Section content rendering */}
                  {section.content && (
                    <div className="text-xl md:text-lg md:text-lg leading-relaxed pl-20 text-blue-800/90">
                      {Object.values(section.content).map((v, i) => (
                        <div key={i} className="mb-2">{typeof v === 'string' ? v : JSON.stringify(v)}</div>
                      ))}
                    </div>
                  )}
                  {section.details && (
                    <div className="text-xl md:text-lg md:text-lg leading-relaxed pl-20 text-blue-900/90">
                      {Object.entries(section.details).map(([k, v], i) => (
                        <div key={i} className="mb-2"><span className="font-bold text-cyan-700">{k.replace(/([a-z])([A-Z])/g, '$1 $2')}: </span>{typeof v === 'string' ? v : JSON.stringify(v)}</div>
                      ))}
                    </div>
                  )}
                  {section.members && Array.isArray(section.members) && (
                    <ul className="space-y-4 pl-20">
                      {section.members.map((member: any, mIdx: number) => (
                        <li key={member.name || mIdx} className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white border-2 border-cyan-200 rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition-transform">
                          <div className="font-extrabold text-blue-800 text-xl md:text-lg mb-1 tracking-tight">{member.name}</div>
                          <div className="text-blue-700 text-xl md:text-lg mb-1 italic">{member.biography}</div>
                          {member.politicalbackground && <div className="text-cyan-700 text-sm mb-1">{member.politicalbackground}</div>}
                          {member.specialization && <div className="text-cyan-600 text-sm mb-1">Specialization: {member.specialization}</div>}
                          {member.contributions && Array.isArray(member.contributions) && (
                            <ul className="list-disc ml-5 text-blue-900 text-sm mb-1">
                              {member.contributions.map((c: string, ci: number) => <li key={ci}>{c}</li>)}
                            </ul>
                          )}
                          {member.replacement && <div className="text-cyan-400 text-sm">Replaced by: {member.replacement}</div>}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.analysis && (
                    <div className="text-xl md:text-lg md:text-lg leading-relaxed pl-20 text-blue-900/90">
                      {Object.entries(section.analysis).map(([k, v], i) => (
                        <div key={i} className="mb-2"><span className="font-bold text-cyan-700">{k.replace(/([a-z])([A-Z])/g, '$1 $2')}: </span>{typeof v === 'string' ? v : JSON.stringify(v)}</div>
                      ))}
                    </div>
                  )}
                  {section.events && Array.isArray(section.events) && (
                    <ul className="space-y-2 pl-20">
                      {section.events.map((event: any, eIdx: number) => (
                        <li key={eIdx} className="mb-2 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 mr-2"></span>
                          <span className="font-semibold text-cyan-700">{event.date || event.year}:</span> <span className="text-blue-900">{event.event}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.components && (
                    <ul className="space-y-2 pl-20">
                      {Object.entries(section.components).map(([k, v], i) => (
                        <li key={i} className="mb-2">
                          <span className="font-bold text-cyan-700">{k.replace(/([a-z])([A-Z])/g, '$1 $2')}: </span>
                          {typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v)}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.influences && (
                    <ul className="space-y-2 pl-20">
                      {Object.entries(section.influences).map(([k, v], i) => (
                        <li key={i} className="mb-2">
                          <span className="font-bold text-cyan-700">{k.charAt(0).toUpperCase() + k.slice(1)}: </span>
                          {typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v)}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.criticisms && Array.isArray(section.criticisms) && (
                    <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-white border-l-8 border-cyan-400 rounded-xl p-6 mt-6 shadow">
                      <div className="font-extrabold text-cyan-700 mb-2 text-lg tracking-tight">Criticisms</div>
                      <ul className="list-disc ml-7 text-blue-900 text-xl md:text-lg">
                        {section.criticisms.map((c: string, ci: number) => <li key={ci}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  {section.strengths && Array.isArray(section.strengths) && (
                    <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-white border-l-8 border-blue-400 rounded-xl p-6 mt-6 shadow">
                      <div className="font-extrabold text-blue-700 mb-2 text-lg tracking-tight">Strengths</div>
                      <ul className="list-disc ml-7 text-blue-900 text-xl md:text-lg">
                        {section.strengths.map((s: string, si: number) => <li key={si}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {section.evolution && (
                    <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-white border-l-8 border-cyan-400 rounded-xl p-6 mt-6 shadow">
                      <div className="font-extrabold text-cyan-700 mb-2 text-lg tracking-tight">Evolution</div>
                      <div className="text-blue-900 text-xl md:text-lg">{section.evolution}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PageLayout>
    </>
  );
}
