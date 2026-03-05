"use client";
import PageLayout from '@components/common/PageLayout';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import Loader from '@components/loader';

export default function DropIrrigationClient() {
  const { locale, isLoading } = useLocale();
  const ns = useLocaleSection('drip-irrigation-process');


  // Compute dripIrrigation object directly from ns
  const dripIrrigation = {
    title: String(ns?.title || ''),
    description: String(ns?.description || ''),
    hero: ns?.hero,
    toc: ns?.toc,
    sections: Array.isArray(ns?.sections) ? ns.sections : [],
    diagram: ns?.diagram,
    cta: ns?.cta
  };

  // Show loading state if locale is still loading and we have no content
  if (isLoading && !dripIrrigation.title) {
    return (
      <PageLayout
        metaKey="drip-irrigation-process"
        title={dripIrrigation?.title}
        description={dripIrrigation?.description || ''}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: dripIrrigation.title }]}
        className="layout-sm"
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
        metaKey="dripIrrigation"
        title={dripIrrigation.title}
        description={dripIrrigation?.description || ''}
        breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: dripIrrigation.title }]}
        className="layout-md"
      >
        <div className="mt-8 space-y-14">
          {dripIrrigation.sections.map(sec => (
            <section key={sec.id} id={sec.id} className="rounded-2xl bg-white border p-6 shadow-sm">
              <h2 className="text-2xl font-bold">{sec.title}</h2>
              {"paragraphs" in sec && (
                <div className="prose max-w-none">
                  {sec.paragraphs?.map((p: any, i: number) => <p key={i}>{p}</p>)}
                  {sec.bullets && (
                    <ul>
                      {sec.bullets.map((b: any, i: number) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              )}

              {"steps" in sec && (
                <ol className="mt-4 space-y-3">
                  {sec.steps.map((s: any, i: number) => (
                    <li key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                      <div className="text-2xl">{s.icon}</div>
                      <div className="md:col-span-4">
                        <p className="font-semibold">{s.title}</p>
                        <p>{s.details}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              {"items" in sec && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sec.items.map((it: any, i: number) => (
                    <article key={i} className="rounded-xl border p-4 bg-slate-50">
                      <p className="font-semibold">{it.name}</p>
                      <p className="mt-1">{it.function}</p>
                      <p className="mt-1 text-sm text-slate-600">{it.sizingNotes}</p>
                    </article>
                  ))}
                </div>
              )}

              {"formulae" in sec && (
                <div className="prose max-w-none">
                  <ul>
                    {sec.formulae.map((f: any, i: number) => (
                      <li key={i} className="mt-2">
                        <p className="font-semibold">{f.name}</p>
                        <code className="block bg-slate-100 p-2 rounded">{f.expr}</code>
                        {f.variables && <p className="text-sm">{f.variables}</p>}
                        {f.units && <p className="text-sm">{f.units}</p>}
                        {f.note && <p className="text-sm italic">{f.note}</p>}
                      </li>
                    ))}
                  </ul>

                  {sec.workedExample && (
                    <div className="mt-4 rounded-lg border p-4 bg-slate-50">
                      <p className="font-semibold">{sec.workedExample.title}</p>
                      <ul className="list-disc ml-5 mt-2">
                        {sec.workedExample.given.map((g: string, i: number) => <li key={i}>{g}</li>)}
                      </ul>
                      <ol className="list-decimal ml-5 mt-2">
                        {sec.workedExample.calc.map((c: string, i: number) => <li key={i}>{c}</li>)}
                      </ol>
                      <p className="mt-2">{sec.workedExample.result}</p>
                    </div>
                  )}
                </div>
              )}

              {"patterns" in sec && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sec.patterns.map((p: any, i: number) => (
                    <div key={i} className="rounded-lg border p-4">
                      <p className="font-semibold">{p.name}</p>
                      <p className="mt-1">{p.description}</p>
                      <p className="mt-2 text-sm"><b>Pros:</b> {p.pros.join(", ")}</p>
                      <p className="text-sm"><b>Cons:</b> {p.cons.join(", ")}</p>
                    </div>
                  ))}
                </div>
              )}

              {"rows" in sec && (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        {sec.columns.map((c: string) => (
                          <th key={c} className="px-3 py-2 text-left border-b">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.rows.map((r: string[], i: number) => (
                        <tr key={i} className="odd:bg-white even:bg-slate-50">
                          {r.map((cell: string, j: number) => (
                            <td key={j} className="px-3 py-2 border-b">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {"terms" in sec && (
                <dl className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sec.terms.map((t: any, i: number) => (
                    <div key={i} className="rounded-lg border p-3">
                      <dt className="font-semibold">{t.term}</dt>
                      <dd className="text-sm mt-1">{t.def}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl bg-white border p-6">
          <h2 className="text-xl font-semibold">{dripIrrigation?.diagram?.title}</h2>
          <pre className="mt-3 font-mono text-sm bg-slate-50 p-4 rounded">{dripIrrigation?.diagram?.lines.join("\n")}</pre>
        </section>

        <section className="mt-8 rounded-2xl bg-emerald-600 p-6 text-white shadow-lg">
          <h3 className="text-xl font-semibold">{dripIrrigation.cta?.title}</h3>
          <p className="mt-1">{dripIrrigation.cta?.body}</p>
          <button className="mt-3 inline-flex items-center rounded-lg bg-white px-4 py-2 text-emerald-700 font-semibold shadow hover:bg-emerald-50">
            {dripIrrigation.cta?.button?.label}
          </button>
        </section>
      </PageLayout>
    </>
  );
}
// Content of DripIrrigationClient.tsx can be added here, depending on the actual code. This is just a placeholder.
