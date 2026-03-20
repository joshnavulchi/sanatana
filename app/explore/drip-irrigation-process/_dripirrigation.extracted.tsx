"use client";

import { Fragment } from 'react';
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';
import LazyImage from '../../components/lazyimage';
const drip_irrigation_process_page = {
  cons: "Cons:",
  crop: "Crop",
  fixes: "Fixes:",
  kc_range: "Kc range",
  likely_causes: "Likely causes:",
  method: "Method",
  pros: "Pros:",
  q: "Q."
};

interface TocItem {
  readonly id: string;
  readonly label: string;
}
interface HeroData {
  readonly title?: string;
  readonly subtitle?: string;
  readonly badge?: string;
}
interface DiagramData {
  readonly title?: string;
  readonly lines?: readonly string[];
}
interface CtaData {
  readonly title?: string;
  readonly body?: string;
  readonly button?: {
    readonly label?: string;
  };
}
interface SectionData {
  readonly id: string;
  readonly title: string;
  readonly summary?: string;
  readonly notes?: string;
  readonly paragraphs?: readonly string[];
  readonly bullets?: readonly string[];
  readonly steps?: readonly {
    readonly icon?: string;
    readonly title?: string;
    readonly step?: string;
    readonly details?: string | readonly string[];
  }[];
  readonly items?: readonly {
    readonly name?: string;
    readonly function?: string;
    readonly sizingNotes?: string;
    readonly symptom?: string;
    readonly q?: string;
    readonly a?: string;
    readonly likelyCauses?: readonly string[];
    readonly fixes?: readonly string[];
  }[];
  readonly formulae?: readonly {
    readonly name?: string;
    readonly expr?: string;
    readonly variables?: string;
    readonly units?: string;
    readonly note?: string;
    readonly example?: string;
  }[];
  readonly workedExample?: {
    readonly title?: string;
    readonly given?: readonly string[];
    readonly calc?: readonly string[];
    readonly result?: string;
  };
  readonly patterns?: readonly {
    readonly name?: string;
    readonly description?: string;
    readonly pros?: readonly string[];
    readonly cons?: readonly string[];
  }[];
  readonly method?: readonly string[];
  readonly typicalKc?: readonly {
    readonly crop?: string;
    readonly range?: string;
  }[];
  readonly applicationRateNote?: string;
  readonly sensors?: readonly string[];
  readonly why?: readonly string[];
  readonly hardware?: readonly string[];
  readonly procedure?: readonly string[];
  readonly safety?: readonly string[];
  readonly checklist?: readonly string[];
  readonly columns?: readonly string[];
  readonly rows?: readonly (readonly string[])[];
  readonly terms?: readonly {
    readonly term?: string;
    readonly def?: string;
  }[];
}
interface DripIrrigationData {
  readonly title: string;
  readonly description: string;
  readonly hero?: HeroData;
  readonly toc?: {
    readonly title?: string;
    readonly items?: readonly TocItem[];
  };
  readonly sections: readonly SectionData[];
  readonly diagram?: DiagramData;
  readonly cta?: CtaData;
}
export default function DropIrrigationClient() {
  const {
    isLoading
  } = useLocale();
  const ns = useLocaleSection('drip-irrigation-process');
  const dripIrrigation: DripIrrigationData = {
    title: String(ns?.title ?? ''),
    description: String(ns?.description ?? ns?.discription ?? ''),
    hero: ns?.hero,
    toc: ns?.toc,
    sections: Array.isArray(ns?.sections) ? ns.sections : [],
    diagram: ns?.diagram,
    cta: ns?.cta
  };
  if (isLoading && !dripIrrigation.title) {
    return <PageLayout metaKey="drip-irrigation-process" title={dripIrrigation.title} description={dripIrrigation.description} breadcrumbs={[{
      labelKey: 'Home',
      href: '/'
    }, {
      label: dripIrrigation.title
    }]} className="layout-md">
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    </PageLayout>;
  }
  const tocItems = dripIrrigation.toc?.items ?? [];
  const renderSectionContent = (section: SectionData) => <div className="mt-5 space-y-5 text-base md:text-md leading-7 text-slate-700">
    {section.summary ? <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
      {section.summary}
    </p> : null}

    {section.notes ? <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800">{section.notes}</p> : null}

    {section.paragraphs?.length ? section.paragraphs.map((paragraph, index) => <p key={`${section.id}-p-${index}`}>{paragraph}</p>) : null}

    {section.bullets?.length ? <ul className="grid gap-3">
      {section.bullets.map((bullet, index) => <li key={`${section.id}-b-${index}`} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
        {bullet}
      </li>)}
    </ul> : null}

    {section.steps?.length ? <ol className="space-y-3">
      {section.steps.map((step, index) => <li key={`${section.id}-step-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-xl md:text-lg">{step.icon ?? '•'}</span>
          <div>
            <h3 className="font-semibold text-slate-900">{step.title ?? step.step}</h3>
            {Array.isArray(step.details) ? <ul className="mt-2 list-disc pl-5 text-xl md:text-lg text-slate-700">
              {step.details.map((detail, detailIndex) => <li key={`${section.id}-step-${index}-detail-${detailIndex}`}>{detail}</li>)}
            </ul> : <p className="mt-1 text-xl md:text-lg text-slate-700">{step.details}</p>}
          </div>
        </div>
      </li>)}
    </ol> : null}

    {section.items?.length ? <div className="grid gap-4 md:grid-cols-2">
      {section.items.map((item, index) => <article key={`${section.id}-item-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
        {item.name ? <h3 className="font-semibold text-slate-900">{item.name}</h3> : null}
        {item.function ? <p className="mt-1 text-xl md:text-lg text-slate-700">{item.function}</p> : null}
        {item.sizingNotes ? <p className="mt-2 text-base md:text-md text-slate-600">{item.sizingNotes}</p> : null}
        {item.symptom ? <p className="mt-1 text-xl md:text-lg font-medium text-slate-900">{item.symptom}</p> : null}
        {item.q ? <p className="mt-1 text-xl md:text-lg font-medium text-slate-900">{drip_irrigation_process_page.q} {item.q}</p> : null}
        {item.a ? <p className="mt-1 text-xl md:text-lg text-slate-700">{item.a}</p> : null}
        {item.likelyCauses?.length ? <p className="mt-2 text-base md:text-md text-slate-600"> {drip_irrigation_process_page.likely_causes} {item.likelyCauses.join(', ')}
        </p> : null}
        {item.fixes?.length ? <p className="mt-1 text-base md:text-md text-slate-600">{drip_irrigation_process_page.fixes} {item.fixes.join(', ')}</p> : null}
      </article>)}
    </div> : null}

    {section.formulae?.length ? <div className="space-y-4">
      {section.formulae.map((formula, index) => <div key={`${section.id}-f-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-900">{formula.name}</h3>
        {formula.expr ? <div className="mt-2 overflow-x-auto rounded-lg bg-slate-900 px-3 py-2 text-xl md:text-lg text-emerald-300">
          {formula.expr}
        </div> : null}
        {formula.variables ? <p className="mt-2 text-base md:text-md text-slate-600">{formula.variables}</p> : null}
        {formula.units ? <p className="mt-1 text-base md:text-md text-slate-600">{formula.units}</p> : null}
        {formula.note ? <p className="mt-1 text-base md:text-md text-slate-600">{formula.note}</p> : null}
        {formula.example ? <p className="mt-1 text-base md:text-md text-slate-600">{formula.example}</p> : null}
      </div>)}
    </div> : null}

    {section.workedExample ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <h3 className="font-semibold text-emerald-900">{section.workedExample.title}</h3>
      {section.workedExample.given?.length ? <ul className="mt-2 list-disc pl-5 text-xl md:text-lg text-emerald-900">
        {section.workedExample.given.map((entry, index) => <li key={`${section.id}-we-g-${index}`}>{entry}</li>)}
      </ul> : null}
      {section.workedExample.calc?.length ? <ol className="mt-2 list-decimal pl-5 text-xl md:text-lg text-emerald-900">
        {section.workedExample.calc.map((entry, index) => <li key={`${section.id}-we-c-${index}`}>{entry}</li>)}
      </ol> : null}
      {section.workedExample.result ? <p className="mt-2 text-xl md:text-lg font-medium text-emerald-900">{section.workedExample.result}</p> : null}
    </div> : null}

    {section.patterns?.length ? <div className="grid gap-4 md:grid-cols-3">
      {section.patterns.map((pattern, index) => <article key={`${section.id}-pattern-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-900">{pattern.name}</h3>
        <p className="mt-1 text-xl md:text-lg text-slate-700">{pattern.description}</p>
        {pattern.pros?.length ? <p className="mt-2 text-base md:text-md text-green-700">{drip_irrigation_process_page.pros} {pattern.pros.join(', ')}</p> : null}
        {pattern.cons?.length ? <p className="mt-1 text-base md:text-md text-red-700">{drip_irrigation_process_page.cons} {pattern.cons.join(', ')}</p> : null}
      </article>)}
    </div> : null}

    {section.method?.length ? <div>
      <h3 className="text-xl md:text-lg font-semibold uppercase tracking-wide text-slate-900">{drip_irrigation_process_page.method}</h3>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-xl md:text-lg text-slate-700">
        {section.method.map((entry, index) => <li key={`${section.id}-m-${index}`}>{entry}</li>)}
      </ol>
    </div> : null}

    {section.typicalKc?.length ? <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-xl md:text-lg">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">{drip_irrigation_process_page.crop}</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">{drip_irrigation_process_page.kc_range}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {section.typicalKc.map((entry, index) => <tr key={`${section.id}-kc-${index}`}>
            <td className="px-3 py-2">{entry.crop}</td>
            <td className="px-3 py-2">{entry.range}</td>
          </tr>)}
        </tbody>
      </table>
    </div> : null}

    {section.applicationRateNote ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xl md:text-lg text-amber-900">
      {section.applicationRateNote}
    </p> : null}

    {section.sensors?.length ? <ul className="list-disc space-y-1 pl-5 text-xl md:text-lg text-slate-700">
      {section.sensors.map((entry, index) => <li key={`${section.id}-sensor-${index}`}>{entry}</li>)}
    </ul> : null}

    {([{
      key: 'Why',
      items: section.why
    }, {
      key: 'Hardware',
      items: section.hardware
    }, {
      key: 'Procedure',
      items: section.procedure
    }, {
      key: 'Safety',
      items: section.safety
    }] as const).map(group => <Fragment key={`${section.id}-${group.key}`}>
      {group.items?.length ? <div>
        <h3 className="text-xl md:text-lg font-semibold uppercase tracking-wide text-slate-900">
          {group.key}
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xl md:text-lg text-slate-700">
          {group.items.map((entry, index) => <li key={`${section.id}-${group.key}-${index}`}>{entry}</li>)}
        </ul>
      </div> : null}
    </Fragment>)}

    {section.checklist?.length ? <ul className="space-y-2">
      {section.checklist.map((entry, index) => <li key={`${section.id}-check-${index}`} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xl md:text-lg">
        {entry}
      </li>)}
    </ul> : null}

    {section.columns?.length && section.rows?.length ? <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-xl md:text-lg">
        <thead className="bg-slate-50">
          <tr>
            {section.columns.map(column => <th key={`${section.id}-${column}`} className="px-3 py-2 text-left font-semibold text-slate-700">
              {column}
            </th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {section.rows.map((row, rowIndex) => <tr key={`${section.id}-row-${rowIndex}`}>
            {row.map((cell, cellIndex) => <td key={`${section.id}-row-${rowIndex}-cell-${cellIndex}`} className="px-3 py-2 text-slate-700">
              {cell}
            </td>)}
          </tr>)}
        </tbody>
      </table>
    </div> : null}

    {section.terms?.length ? <div className="grid gap-3 md:grid-cols-2">
      {section.terms.map((term, index) => <article key={`${section.id}-term-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-900">{term.term}</h3>
        <p className="mt-1 text-xl md:text-lg text-slate-700">{term.def}</p>
      </article>)}
    </div> : null}
  </div>;
  return <PageLayout metaKey="drip-irrigation-process" title={dripIrrigation.title} description={dripIrrigation.description} breadcrumbs={[{
    labelKey: 'Home',
    href: '/'
  }, {
    label: dripIrrigation.title
  }]} className="layout-md">
    <section className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 shadow-sm md:p-8">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-100 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-100 blur-3xl" aria-hidden="true" />
      <div className="relative">
        {dripIrrigation.hero?.badge ? <span className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-base md:text-md font-semibold uppercase tracking-wider text-emerald-700">
          {dripIrrigation.hero.badge}
        </span> : null}
        <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {dripIrrigation.hero?.title || dripIrrigation.title}
        </h3>
        {dripIrrigation.hero?.subtitle ? <p className="mt-3 max-w-3xl text-base md:text-md text-slate-700 md:text-xl md:text-lg">
          {dripIrrigation.hero.subtitle}
        </p> : null}
        {dripIrrigation.description ? <p className="mt-4 max-w-4xl text-xl md:text-lg leading-7 text-slate-600 md:text-base md:text-md">
          {dripIrrigation.description}
        </p> : null}
      </div>
    </section>

    <div className="flex flex-col mt-8 gap-6">
      <aside className="lg:h-fit md:hidden">
        {tocItems.length ? <nav className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label={dripIrrigation.toc?.title || 'On this page'}>
          <h4 className="mb-3 text-xl md:text-lg font-semibold uppercase tracking-wide text-slate-900">
            {dripIrrigation.toc?.title || 'On this page'}
          </h4>
          <ul className="space-y-1">
            {tocItems.map(item => <li key={item.id}>
              <a href={`#${item.id}`} className="block rounded-lg px-2 py-1.5 text-xl md:text-lg text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
                {item.label}
              </a>
            </li>)}
          </ul>
        </nav> : null}
      </aside>

      <div className="space-y-6">
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm">
          <LazyImage src="/images/drip-irrigation.png" width="1600" height="200" className="p-5" alt="Drip Irrigation Process" />
        </div>

        {dripIrrigation.sections.map(section => <section key={section.id} id={section.id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h5 className="text-2xl font-bold text-slate-900">{section.title}</h5>
          {renderSectionContent(section)}
        </section>)}

        {dripIrrigation.diagram ? <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm md:p-6">
          <h6 className="text-2xl font-bold text-indigo-950">{dripIrrigation.diagram.title}</h6>
          <div className="mt-4 overflow-x-auto rounded-xl bg-indigo-950 p-4">
            <pre className="whitespace-pre-wrap font-mono text-base md:text-md leading-7 text-indigo-100">
              {(dripIrrigation.diagram.lines || []).join('\n')}
            </pre>
          </div>
        </section> : null}

        {dripIrrigation.cta ? <section className="rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 p-6 text-white shadow-lg mb-8 md:mb-0">
          <h6 className="text-2xl">{dripIrrigation.cta.title}</h6>
          {dripIrrigation.cta.body ? <p className="mt-2 max-w-3xl text-emerald-50">{dripIrrigation.cta.body}</p> : null}
          <button type="button" className="mt-4 items-center rounded-lg bg-white px-4 py-2 text-xl md:text-lg font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 hidden">
            {dripIrrigation.cta.button?.label || 'Get Started'}
          </button>
        </section> : null}
      </div>
    </div>
  </PageLayout>;
}