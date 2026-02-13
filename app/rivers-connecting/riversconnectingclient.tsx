"use client";
import { useEffect, useState } from 'react';
import PageLayout from '@/app/components/common/PageLayout';
import { useLocale } from '../context/locale-context';
import useLocaleSection from '../hooks/useLocaleSection';
import { parseSections, parseMaybeObject } from 'lib/parseContent';
import Loader from '@/app/components/loader/loader';
import SimilarCategories from '@/app/components/similar-categories/SimilarCategories';
import TextToSpeech from '@/app/components/text-to-speech/TextToSpeech';

export default function RiversConnectingClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('rivers_connecting');

  const [data, setData] = useState({ title: '', intro: '', content: '', ganttData: [] as any[] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const container = ns?.rivers_connecting ?? ns ?? {};
      const title = String(container?.title || '');
      // Handle content as both string and array
      const rawContent = container?.content || '';
      const intro = String(container?.intro || '');
      const content = Array.isArray(rawContent) ? rawContent.join('\n') : String(rawContent);
      const ganttData = Array.isArray(container?.ganttData) ? container.ganttData : [];
      setData({ title, intro, content, ganttData });
    })();
    return () => { mounted = false; };
  }, [locale, ns]);

  if (isLoading && !data.title) {
    return (
      <PageLayout metaKey="rivers_connecting" title="" breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Rivers Connecting' }]} className="layout-md">
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      metaKey="rivers_connecting"
      title={data.title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: data.title }]}
      className="layout-md"
    >
      <TextToSpeech sectionId="rivers_connecting" className="floating" />

      <div id="rivers_connecting-content">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <div className="relative px-3 md:px-6 py-12 md:py-16 bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-50 rounded-2xl border-l-4 border-blue-400 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/8 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-600" />
                  <span className="text-3xl animate-pulse">🌊</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-600">{data.intro}</div>
                </div>
              </div>
            </div>

            {data.content && (
              <div className="relative bg-white border-l-4 border-blue-300 rounded-2xl p-6 md:p-8 mt-12 shadow-xl">
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: data.content.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            )}

            {data.ganttData && data.ganttData.length > 0 && (
              <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 mt-16 shadow-2xl overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500 rounded-full blur-3xl" />
                </div>

                {/* Header */}
                <div className="relative z-10 mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
                    <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Project Timeline 2026–2040
                    </h3>
                    <div className="h-1 flex-1 bg-gradient-to-r from-cyan-400 to-transparent rounded-full" />
                  </div>
                  <p className="text-gray-600 ml-20">River interlinking phased implementation roadmap</p>
                </div>

                {/* Timeline visualization */}
                <div className="relative z-10 space-y-12">
                  {data.ganttData.map((project: any, index: number) => {
                    const colors = [
                      { primary: 'from-blue-500 to-cyan-500', light: 'from-blue-100 to-cyan-100', border: 'border-blue-400', accent: 'bg-blue-500' },
                      { primary: 'from-emerald-500 to-teal-500', light: 'from-emerald-100 to-teal-100', border: 'border-emerald-400', accent: 'bg-emerald-500' },
                      { primary: 'from-violet-500 to-purple-500', light: 'from-violet-100 to-purple-100', border: 'border-violet-400', accent: 'bg-violet-500' },
                      { primary: 'from-amber-500 to-orange-500', light: 'from-amber-100 to-orange-100', border: 'border-amber-400', accent: 'bg-amber-500' },
                      { primary: 'from-rose-500 to-pink-500', light: 'from-rose-100 to-pink-100', border: 'border-rose-400', accent: 'bg-rose-500' },
                      { primary: 'from-indigo-500 to-blue-500', light: 'from-indigo-100 to-blue-100', border: 'border-indigo-400', accent: 'bg-indigo-500' },
                      { primary: 'from-fuchsia-500 to-purple-500', light: 'from-fuchsia-100 to-purple-100', border: 'border-fuchsia-400', accent: 'bg-fuchsia-500' }
                    ];
                    const color = colors[index % colors.length];

                    return (
                      <div key={project.id || index} className="relative group">
                        {/* Project header with icon */}
                        <div className="flex items-start gap-4 mb-6">
                          <div className={`flex-shrink-0 w-14 h-14 ${color.accent} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                            {['🏗️', '🌊', '⚡', '🏞️', '💧', '🚧', '🌉'][index % 7]}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {project.name}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="px-2 py-1 bg-white rounded-full shadow-sm">{project.phases?.length || 0} phases</span>
                              <span>•</span>
                              <span>ID: {project.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* Timeline flow */}
                        <div className="ml-7 pl-8 border-l-4 border-dashed border-gray-300 space-y-6 pb-4">
                          {project.phases && project.phases.map((phase: any, phaseIndex: number) => {
                            const getPhaseStyle = (type: string) => {
                              switch (type) {
                                case 'approval':
                                  return { bg: 'bg-gradient-to-r from-yellow-400 to-amber-400', icon: '📋', textColor: 'text-yellow-900', ring: 'ring-yellow-300' };
                                case 'execution':
                                  return { bg: 'bg-gradient-to-r from-green-400 to-emerald-400', icon: '⚙️', textColor: 'text-green-900', ring: 'ring-green-300' };
                                case 'milestone':
                                  return { bg: 'bg-gradient-to-r from-purple-400 to-fuchsia-400', icon: '🎯', textColor: 'text-purple-900', ring: 'ring-purple-300' };
                                case 'operations':
                                  return { bg: 'bg-gradient-to-r from-slate-400 to-gray-400', icon: '🔄', textColor: 'text-slate-900', ring: 'ring-slate-300' };
                                default:
                                  return { bg: 'bg-gradient-to-r from-blue-400 to-cyan-400', icon: '📍', textColor: 'text-blue-900', ring: 'ring-blue-300' };
                              }
                            };

                            const phaseStyle = getPhaseStyle(phase.type);
                            const isLastPhase = phaseIndex === project.phases.length - 1;

                            return (
                              <div key={phaseIndex} className="relative group/phase">
                                {/* Connection dot */}
                                <div className={`absolute -left-[2.6rem] top-3 w-5 h-5 ${phaseStyle.bg} rounded-full ${phaseStyle.ring} ring-4 shadow-lg transform group-hover/phase:scale-125 transition-transform duration-300 z-10`} />
                                
                                {/* Phase card */}
                                <div className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${color.border} group-hover/phase:translate-x-2`}>
                                  {/* Gradient overlay */}
                                  <div className={`absolute inset-0 bg-gradient-to-r ${color.light} opacity-0 group-hover/phase:opacity-100 transition-opacity duration-300`} />
                                  
                                  <div className="relative p-5">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <span className="text-2xl">{phaseStyle.icon}</span>
                                          <h5 className={`text-lg font-bold ${phaseStyle.textColor}`}>
                                            {phase.label}
                                          </h5>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-sm">
                                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <span className="text-gray-500">Start:</span>
                                            <span className="font-semibold text-gray-700">{phase.start}</span>
                                          </div>
                                          <span className="text-gray-400">→</span>
                                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <span className="text-gray-500">End:</span>
                                            <span className="font-semibold text-gray-700">{phase.end}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Phase type badge */}
                                      <div className={`${phaseStyle.bg} text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-md`}>
                                        {phase.type}
                                      </div>
                                    </div>

                                    {/* Duration bar */}
                                    <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${phaseStyle.bg} rounded-full animate-pulse`}
                                        style={{ width: '100%' }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Flowing connector for non-last phases */}
                                {!isLastPhase && (
                                  <div className="absolute -left-[2.1rem] top-8 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-cyan-300 to-transparent" />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Project completion indicator */}
                        <div className="ml-7 pl-8 mt-4">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${color.primary} text-white rounded-full shadow-lg text-sm font-semibold`}>
                            <span>✓</span>
                            <span>Project Timeline Complete</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="relative z-10 mt-16 pt-8 border-t-2 border-dashed border-gray-300">
                  <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Phase Types Legend</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { type: 'Approval', icon: '📋', color: 'from-yellow-400 to-amber-400' },
                      { type: 'Execution', icon: '⚙️', color: 'from-green-400 to-emerald-400' },
                      { type: 'Milestone', icon: '🎯', color: 'from-purple-400 to-fuchsia-400' },
                      { type: 'Operations', icon: '🔄', color: 'from-slate-400 to-gray-400' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-lg shadow`}>
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/4">
            <div className="sticky top-24">
              <SimilarCategories currentCategory="infrastructure" />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
