"use client";

import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import UsaStrategyD3Map from './UsaStrategyD3Map';
import UsaStrategyFlowD3 from './UsaStrategyFlowD3';
const usa_strategies_page = {
  addition_forced: "Additional Forced Surrenders (Not Directly to U.S.)",
  asia_interven: "Asia Interventions Timeline",
  comparat_view: "Comparative view of real-world strategic leverage using qualitative effectiveness converted\n                into relative strength bands.",
  countrie: "Countries:",
  country: "Country",
  cross_cutting: "Cross-Cutting Tools",
  d3_visualiz: "D3 Visualization",
  derived_from: "Derived from strategies_effectiveness",
  effectiv: "Effectiveness:",
  evidence_refs: "Evidence refs (",
  flow_architec: "Flow Architecture",
  forced_surrende: "Forced Surrenders",
  global_strategy: "Global Strategy Map",
  grand_strategy: "Grand Strategy Context",
  group: "Group",
  interact_patterns: "Interaction Patterns",
  iso3: "ISO3",
  last_updated: "Last updated:",
  latam_vs: "LATAM vs Asia-Pacific",
  latitude: "Latitude",
  longitud: "Longitude",
  map_points: "Map Points",
  map_targeted: "Map Targeted Regions",
  notes: "Notes",
  primary_drivers: "Primary Drivers",
  projecti_hint: "Projection hint:",
  reality_chart: "Reality Chart",
  reality_first: "Reality-first pipeline from objective setting to policy outcomes, extracted from source\n                Mermaid graph.",
  regional_comparis: "Regional Comparison",
  sources: "Sources:",
  strategi_flowchar: "Strategic Flowchart (Redesigned)",
  targetin_motives: "Targeting Motives",
  timeline_presiden: "Timeline by President",
  tools: "Tools:",
  typical_mechanis: "Typical Mechanisms",
  usa_strategi: "USA Strategies Atlas",
  when: "When",
  why: "Why"
};

interface FlowchartData {
  readonly format?: string;
  readonly file?: string;
  readonly content?: string;
  readonly sources?: readonly string[];
}
interface TimelineEntry {
  readonly years?: string;
  readonly president?: string;
  readonly key_strategies?: readonly string[];
  readonly tools_used?: readonly string[];
  readonly notable_policies_events?: readonly string[];
  readonly sources?: readonly string[];
}
interface ToolDescriptor {
  readonly description?: string;
  readonly sources?: readonly string[];
}
type ToolGroup = Record<string, ToolDescriptor>;
interface PatternEntry {
  readonly pattern?: string;
  readonly insight?: string;
  readonly sources?: readonly string[];
}
interface StrategyEffectiveness {
  readonly strategy?: string;
  readonly effectiveness?: string;
  readonly evidence?: readonly string[];
}
interface MotiveEntry {
  readonly reason?: string;
  readonly sources?: readonly string[];
}
interface RegionalTopStrategy {
  readonly name?: string;
  readonly effectiveness?: string;
  readonly why?: string;
  readonly evidence?: readonly string[];
}
interface RegionalEntry {
  readonly region?: string;
  readonly top_strategies?: readonly RegionalTopStrategy[];
}
interface AsiaIntervention {
  readonly years?: string;
  readonly event?: string;
  readonly summary?: string;
  readonly sources?: readonly string[];
}
interface MapLayer {
  readonly label?: string;
  readonly countries?: readonly string[];
  readonly explanatory_note?: string;
  readonly sources?: readonly string[];
}
interface MapTargetedRegions {
  readonly projection_hint?: string;
  readonly latin_america_layer?: MapLayer;
  readonly asia_pacific_layer?: MapLayer;
}
interface MapVisualization {
  readonly type?: string;
  readonly spec_file?: string;
  readonly description?: string;
  readonly categories?: Record<string, string>;
  readonly sources?: readonly string[];
}
interface MapPoint {
  readonly name?: string;
  readonly iso3?: string;
  readonly lat?: number;
  readonly lon?: number;
  readonly group?: string;
}
interface SurrenderEntry {
  readonly country?: string;
  readonly when?: string;
  readonly why?: string;
  readonly who_signed_for_opponent?: string;
  readonly sources?: readonly string[];
}
interface ComparisonSection {
  readonly primary_drivers?: readonly string[];
  readonly typical_mechanisms?: readonly string[];
  readonly sources?: readonly string[];
  readonly mechanism_sources?: readonly string[];
}
interface UsaStrategiesData {
  readonly title: string;
  readonly description: string;
  readonly flowchart?: FlowchartData;
  readonly timeline_by_president: readonly TimelineEntry[];
  readonly cross_cutting_tools?: {
    readonly finance?: ToolGroup;
    readonly technology_controls?: ToolGroup;
    readonly machines_security?: ToolGroup;
    readonly grand_strategy_context?: ToolDescriptor;
  };
  readonly interaction_patterns: readonly PatternEntry[];
  readonly strategies_effectiveness: readonly StrategyEffectiveness[];
  readonly us_targeting_motives?: Record<string, readonly MotiveEntry[]>;
  readonly comparison_latin_america_vs_asia?: {
    readonly overview?: string;
    readonly latin_america?: ComparisonSection;
    readonly asia_pacific?: ComparisonSection;
  };
  readonly regional_strategy_comparison_v3?: {
    readonly last_updated_utc?: string;
    readonly regions?: readonly RegionalEntry[];
  };
  readonly asia_interventions_timeline: readonly AsiaIntervention[];
  readonly map_targeted_regions?: MapTargetedRegions;
  readonly map_visualization?: MapVisualization;
  readonly datasets?: {
    readonly map_points?: readonly MapPoint[];
  };
  readonly forced_surrenders: readonly SurrenderEntry[];
  readonly additional_forced_surrenders_not_directly_to_us: readonly SurrenderEntry[];
  readonly notes: readonly string[];
}
function toHeading(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}
function renderSources(sources?: readonly string[]) {
  if (!sources?.length) return null;
  return <p className="mt-2 text-base text-slate-500"> {usa_strategies_page.sources} {sources.join(', ')}
    </p>;
}
function getEffectivenessScore(effectiveness?: string) {
  const normalized = String(effectiveness ?? '').toLowerCase();
  if (normalized.includes('medium') && normalized.includes('high')) return 78;
  if (normalized.includes('high') && normalized.includes('historical')) return 72;
  if (normalized.includes('high')) return 88;
  if (normalized.includes('medium')) return 62;
  if (normalized.includes('variable')) return 55;
  if (normalized.includes('low')) return 38;
  return 50;
}
function getRealityTone(score: number) {
  if (score >= 80) {
    return {
      bar: 'bg-emerald-500',
      badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      label: 'Strong'
    };
  }
  if (score >= 60) {
    return {
      bar: 'bg-amber-500',
      badge: 'border-amber-200 bg-amber-50 text-amber-700',
      label: 'Moderate'
    };
  }
  return {
    bar: 'bg-rose-500',
    badge: 'border-rose-200 bg-rose-50 text-rose-700',
    label: 'Constrained'
  };
}
export default function UsaStrategiesClient() {
  const {
    isLoading
  } = useLocale();
  const ns = useLocaleSection('usa-strategies');
  const data: UsaStrategiesData = {
    title: String(ns?.title ?? ''),
    description: String(ns?.description ?? ns?.discription ?? ''),
    flowchart: ns?.flowchart,
    timeline_by_president: Array.isArray(ns?.timeline_by_president) ? ns.timeline_by_president : [],
    cross_cutting_tools: ns?.cross_cutting_tools,
    interaction_patterns: Array.isArray(ns?.interaction_patterns) ? ns.interaction_patterns : [],
    strategies_effectiveness: Array.isArray(ns?.strategies_effectiveness) ? ns.strategies_effectiveness : [],
    us_targeting_motives: ns?.us_targeting_motives,
    comparison_latin_america_vs_asia: ns?.comparison_latin_america_vs_asia,
    regional_strategy_comparison_v3: ns?.regional_strategy_comparison_v3,
    asia_interventions_timeline: Array.isArray(ns?.asia_interventions_timeline) ? ns.asia_interventions_timeline : [],
    map_targeted_regions: ns?.map_targeted_regions,
    map_visualization: ns?.map_visualization,
    datasets: ns?.datasets,
    forced_surrenders: Array.isArray(ns?.forced_surrenders) ? ns.forced_surrenders : [],
    additional_forced_surrenders_not_directly_to_us: Array.isArray(ns?.additional_forced_surrenders_not_directly_to_us) ? ns.additional_forced_surrenders_not_directly_to_us : [],
    notes: Array.isArray(ns?.notes) ? ns.notes : []
  };
  if (isLoading && !data.title) {
    return <PageLayout metaKey="usa-strategies" title={data.title} description={data.description} breadcrumbs={[{
      labelKey: 'Home',
      href: '/'
    }, {
      label: 'USA Strategies'
    }]} className="layout-md">
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>;
  }
  const quickStats = [{
    label: 'Presidential Eras',
    value: data.timeline_by_president.length
  }, {
    label: 'Cross-Region Patterns',
    value: data.interaction_patterns.length
  }, {
    label: 'Map Points',
    value: data.datasets?.map_points?.length ?? 0
  }, {
    label: 'Surrender Records',
    value: data.forced_surrenders.length
  }];
  const sectionCardClass = 'scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8';
  const flowHighlights = Array.from(new Set((data.flowchart?.content ?? '').split('\n').flatMap(line => Array.from(line.matchAll(/\[([^\]]+)\]/g)).map(match => match[1].trim())).filter(Boolean))).slice(0, 14);
  return <PageLayout metaKey="usa-strategies" title={data.title} description={data.description} breadcrumbs={[{
    labelKey: 'Home',
    href: '/'
  }, {
    label: 'USA Strategies'
  }]} className="layout-md">
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-6 shadow-sm md:p-8">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky-100 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-14 -left-12 h-36 w-36 rounded-full bg-violet-100 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-base font-semibold uppercase tracking-wider text-sky-700"> {usa_strategies_page.usa_strategi} </span>
            <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {data.title}
            </h3>
            {data.description ? <p className="mt-4 max-w-5xl text-md md:text-lg leading-7 text-slate-700 md:text-base">
                {data.description}
              </p> : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickStats.map(item => <div key={item.label} className="rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-sm">
                  <p className="text-base font-semibold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm uppercase tracking-wide text-slate-600">{item.label}</p>
                </div>)}
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {data.flowchart?.content ? <section id="flowchart" className="scroll-mt-24 rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-cyan-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700"> {usa_strategies_page.flow_architec} </span>
                {data.flowchart.file ? <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {data.flowchart.file}
                  </span> : null}
              </div>
              <h5 className="mt-3 text-2xl font-bold text-slate-900">{usa_strategies_page.strategi_flowchar}</h5>
              <p className="mt-2 text-base text-slate-700"> {usa_strategies_page.reality_first} </p>

              {flowHighlights.length ? <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {flowHighlights.map(node => <div key={node} className="rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                      {node}
                    </div>)}
                </div> : null}

              <div className="mt-5">
                <UsaStrategyFlowD3 mermaidContent={data.flowchart.content} />
              </div>

              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-slate-700 md:text-sm">
                  {data.flowchart.content}
                </pre>
              </div>
              {renderSources(data.flowchart.sources)}
            </section> : null}

          {data.timeline_by_president.length ? <section id="timeline" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.timeline_presiden}</h5>
              <div className="mt-5 grid gap-4">
                {data.timeline_by_president.map((entry, index) => <article key={`${entry.president ?? 'president'}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full border border-sky-300 bg-sky-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-sky-800">
                        {entry.years}
                      </span>
                      <h6 className="text-md md:text-lg font-semibold text-slate-900">{entry.president}</h6>
                    </div>
                    {entry.key_strategies?.length ? <ul className="mt-3 list-disc pl-5 text-md md:text-lg text-slate-700">
                        {entry.key_strategies.map((item, itemIndex) => <li key={`${entry.president}-strategy-${itemIndex}`}>{item}</li>)}
                      </ul> : null}
                    {entry.tools_used?.length ? <p className="mt-2 text-base text-slate-600"> {usa_strategies_page.tools} {entry.tools_used.join(', ')}
                      </p> : null}
                    {entry.notable_policies_events?.length ? <ul className="mt-2 list-disc pl-5 text-base text-slate-600">
                        {entry.notable_policies_events.map((item, itemIndex) => <li key={`${entry.president}-event-${itemIndex}`}>{item}</li>)}
                      </ul> : null}
                    {renderSources(entry.sources)}
                  </article>)}
              </div>
            </section> : null}

          {data.cross_cutting_tools ? <section id="tools" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.cross_cutting}</h5>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {([['finance', data.cross_cutting_tools.finance], ['technology_controls', data.cross_cutting_tools.technology_controls], ['machines_security', data.cross_cutting_tools.machines_security]] as const).map(([name, group]) => group ? <article key={name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <h6 className="text-md md:text-lg font-semibold text-slate-900">
                        {toHeading(name)}
                      </h6>
                      <div className="mt-3 space-y-3">
                        {Object.entries(group).map(([itemKey, itemValue]) => <div key={itemKey} className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="font-medium text-slate-900">{toHeading(itemKey)}</p>
                            {itemValue.description ? <p className="mt-1 text-md md:text-lg text-slate-700">
                                {itemValue.description}
                              </p> : null}
                            {renderSources(itemValue.sources)}
                          </div>)}
                      </div>
                    </article> : null)}
                {data.cross_cutting_tools.grand_strategy_context ? <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:col-span-2">
                    <h6 className="text-md md:text-lg font-semibold text-slate-900"> {usa_strategies_page.grand_strategy} </h6>
                    {data.cross_cutting_tools.grand_strategy_context.description ? <p className="mt-2 text-md md:text-lg text-slate-700">
                        {data.cross_cutting_tools.grand_strategy_context.description}
                      </p> : null}
                    {renderSources(data.cross_cutting_tools.grand_strategy_context.sources)}
                  </article> : null}
              </div>
            </section> : null}

          {data.interaction_patterns.length ? <section id="patterns" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.interact_patterns}</h5>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {data.interaction_patterns.map((entry, index) => <article key={`${entry.pattern ?? 'pattern'}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h6 className="text-md md:text-lg font-semibold text-slate-900">{entry.pattern}</h6>
                    <p className="mt-2 text-md md:text-lg text-slate-700">{entry.insight}</p>
                    {renderSources(entry.sources)}
                  </article>)}
              </div>
            </section> : null}

          {data.strategies_effectiveness.length ? <section id="effectiveness" className={sectionCardClass}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.reality_chart}</h5>
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700"> {usa_strategies_page.derived_from} </span>
              </div>
              <p className="mt-2 text-base text-slate-600"> {usa_strategies_page.comparat_view} </p>

              <div className="mt-5 space-y-4">
                {data.strategies_effectiveness.map((entry, index) => {
              const score = getEffectivenessScore(entry.effectiveness);
              const tone = getRealityTone(score);
              return <article key={`${entry.strategy ?? 'strategy'}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h6 className="text-md md:text-lg font-semibold text-slate-900">
                          {entry.strategy}
                        </h6>
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${tone.badge}`}>
                          {tone.label} • {score}%
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-600">{entry.effectiveness}</p>

                      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                        <div className={`h-full rounded-full ${tone.bar}`} style={{
                    width: `${score}%`
                  }} aria-label={`${entry.strategy} score ${score}`} />
                      </div>

                      {entry.evidence?.length ? <p className="mt-3 text-sm text-slate-500"> {usa_strategies_page.evidence_refs}{entry.evidence.length}): {entry.evidence.join(', ')}
                        </p> : null}
                    </article>;
            })}
              </div>
            </section> : null}

          {data.us_targeting_motives ? <section id="motives" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.targetin_motives}</h5>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {Object.entries(data.us_targeting_motives).map(([region, motives]) => <article key={region} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h6 className="text-md md:text-lg font-semibold text-slate-900">
                      {toHeading(region)}
                    </h6>
                    <ul className="mt-2 list-disc pl-5 text-md md:text-lg text-slate-700">
                      {motives.map((item, index) => <li key={`${region}-motive-${index}`}>{item.reason}</li>)}
                    </ul>
                  </article>)}
              </div>
            </section> : null}

          {data.comparison_latin_america_vs_asia ? <section id="comparison" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.latam_vs}</h5>
              {data.comparison_latin_america_vs_asia.overview ? <p className="mt-2 text-md md:text-lg text-slate-700">
                  {data.comparison_latin_america_vs_asia.overview}
                </p> : null}
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {([['Latin America', data.comparison_latin_america_vs_asia.latin_america], ['Asia Pacific', data.comparison_latin_america_vs_asia.asia_pacific]] as const).map(([label, section]) => section ? <article key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <h6 className="text-md md:text-lg font-semibold text-slate-900">{label}</h6>
                      {section.primary_drivers?.length ? <>
                          <p className="mt-2 text-base font-medium text-slate-800">{usa_strategies_page.primary_drivers}</p>
                          <ul className="mt-1 list-disc pl-5 text-md md:text-lg text-slate-700">
                            {section.primary_drivers.map((entry, index) => <li key={`${label}-driver-${index}`}>{entry}</li>)}
                          </ul>
                        </> : null}
                      {section.typical_mechanisms?.length ? <>
                          <p className="mt-3 text-base font-medium text-slate-800">{usa_strategies_page.typical_mechanis}</p>
                          <ul className="mt-1 list-disc pl-5 text-md md:text-lg text-slate-700">
                            {section.typical_mechanisms.map((entry, index) => <li key={`${label}-mechanism-${index}`}>{entry}</li>)}
                          </ul>
                        </> : null}
                    </article> : null)}
              </div>
            </section> : null}

          {data.regional_strategy_comparison_v3?.regions?.length ? <section id="regional" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.regional_comparis}</h5>
              {data.regional_strategy_comparison_v3.last_updated_utc ? <p className="mt-2 text-base text-slate-600"> {usa_strategies_page.last_updated} {data.regional_strategy_comparison_v3.last_updated_utc}
                </p> : null}
              <div className="mt-5 grid gap-4">
                {data.regional_strategy_comparison_v3.regions.map((region, index) => <article key={`${region.region ?? 'region'}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h6 className="text-md md:text-lg font-semibold text-slate-900">{region.region}</h6>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {(region.top_strategies ?? []).map((strategy, strategyIndex) => <div key={`${region.region}-top-strategy-${strategyIndex}`} className="rounded-xl border border-slate-200 bg-white p-4">
                          <p className="font-semibold text-slate-900">{strategy.name}</p>
                          {strategy.effectiveness ? <p className="mt-1 text-base text-indigo-700"> {usa_strategies_page.effectiv} {strategy.effectiveness}
                            </p> : null}
                          {strategy.why ? <p className="mt-1 text-md md:text-lg text-slate-700">{strategy.why}</p> : null}
                        </div>)}
                    </div>
                  </article>)}
              </div>
            </section> : null}

          {data.asia_interventions_timeline.length ? <section id="interventions" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.asia_interven}</h5>
              <div className="mt-5 grid gap-4">
                {data.asia_interventions_timeline.map((entry, index) => <article key={`${entry.event ?? 'event'}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h6 className="text-md md:text-lg font-semibold text-slate-900">
                      {entry.event} ({entry.years})
                    </h6>
                    <p className="mt-2 text-md md:text-lg text-slate-700">{entry.summary}</p>
                    {renderSources(entry.sources)}
                  </article>)}
              </div>
            </section> : null}

          {data.map_targeted_regions ? <section id="map-regions" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.map_targeted}</h5>
              {data.map_targeted_regions.projection_hint ? <p className="mt-2 text-md md:text-lg text-slate-700">
                  {data.map_targeted_regions.projection_hint}
                </p> : null}
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {([['Latin America Layer', data.map_targeted_regions.latin_america_layer], ['Asia Pacific Layer', data.map_targeted_regions.asia_pacific_layer]] as const).map(([label, layer]) => layer ? <article key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <h6 className="text-md md:text-lg font-semibold text-slate-900">{label}</h6>
                      {layer.label ? <p className="mt-1 text-md md:text-lg text-slate-700">{layer.label}</p> : null}
                      {layer.countries?.length ? <p className="mt-2 text-base text-slate-600"> {usa_strategies_page.countrie} {layer.countries.join(', ')}
                        </p> : null}
                      {layer.explanatory_note ? <p className="mt-2 text-base text-slate-600">{layer.explanatory_note}</p> : null}
                      {renderSources(layer.sources)}
                    </article> : null)}
              </div>
            </section> : null}

          {data.datasets?.map_points?.length ? <section id="d3-map" className={sectionCardClass}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700"> {usa_strategies_page.d3_visualiz} </span>
                {data.map_visualization?.type ? <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {data.map_visualization.type}
                  </span> : null}
                {data.map_visualization?.spec_file ? <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {data.map_visualization.spec_file}
                  </span> : null}
              </div>

              <h5 className="mt-3 text-2xl font-bold text-slate-900">{usa_strategies_page.global_strategy}</h5>

              <UsaStrategyD3Map points={data.datasets.map_points} mapVisualization={data.map_visualization} className="mt-4" />

              {data.map_targeted_regions?.projection_hint ? <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:text-base"> {usa_strategies_page.projecti_hint} {data.map_targeted_regions.projection_hint}
                </p> : null}

              {renderSources(data.map_visualization?.sources)}
            </section> : null}

          {data.datasets?.map_points?.length ? <section id="map-points" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.map_points}</h5>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-md md:text-lg">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.country}</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.iso3}</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.latitude}</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.longitud}</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.group}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {data.datasets.map_points.map((point, index) => <tr key={`${point.iso3 ?? 'point'}-${index}`}>
                        <td className="px-3 py-2 text-slate-700">{point.name}</td>
                        <td className="px-3 py-2 text-slate-700">{point.iso3}</td>
                        <td className="px-3 py-2 text-slate-700">{point.lat}</td>
                        <td className="px-3 py-2 text-slate-700">{point.lon}</td>
                        <td className="px-3 py-2 text-slate-700">{point.group}</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </section> : null}

          {data.forced_surrenders.length ? <section id="surrenders" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900">{usa_strategies_page.forced_surrende}</h5>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-md md:text-lg">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.country}</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.when}</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.why}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {data.forced_surrenders.map((entry, index) => <tr key={`${entry.country ?? 'surrender'}-${index}`}>
                        <td className="px-3 py-2 text-slate-700">{entry.country}</td>
                        <td className="px-3 py-2 text-slate-700">{entry.when}</td>
                        <td className="px-3 py-2 text-slate-700">{entry.why}</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </section> : null}

          {data.additional_forced_surrenders_not_directly_to_us.length ? <section id="additional-surrenders" className={sectionCardClass}>
              <h5 className="text-2xl font-bold text-slate-900"> {usa_strategies_page.addition_forced} </h5>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-md md:text-lg">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.country}</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.when}</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">{usa_strategies_page.why}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {data.additional_forced_surrenders_not_directly_to_us.map((entry, index) => <tr key={`${entry.country ?? 'additional-surrender'}-${index}`}>
                        <td className="px-3 py-2 text-slate-700">{entry.country}</td>
                        <td className="px-3 py-2 text-slate-700">{entry.when}</td>
                        <td className="px-3 py-2 text-slate-700">{entry.why}</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </section> : null}

          {data.notes.length ? <section id="notes" className="scroll-mt-24 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm md:p-8">
              <h5 className="text-2xl font-bold text-amber-900">{usa_strategies_page.notes}</h5>
              <ul className="mt-3 list-disc pl-5 text-md md:text-lg text-amber-900">
                {data.notes.map((note, index) => <li key={`note-${index}`}>{note}</li>)}
              </ul>
            </section> : null}
        </div>
      </div>
    </PageLayout>;
}