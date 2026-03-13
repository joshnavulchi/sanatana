import { DEFAULT_LOCALE, getLocaleNamespaceObject } from '@lib/i18n';

type Yuga = { name?: string; subtitle?: string; years?: string; description?: string[] };

export default function OurFourCoreYugas() {
  const ns = getLocaleNamespaceObject(DEFAULT_LOCALE, 'home') as any;
  const yugas = (ns?.home?.yugas || ns?.yugas || []) as Yuga[];

  return (
    <section className="space-y-4">
      {yugas.map((yuga, index) => (
        <article key={`${yuga.name || 'yuga'}-${index}`} className="rounded-xl border p-4 bg-white">
          <h3 className="font-semibold">{yuga.name || `Yuga ${index + 1}`}</h3>
          {yuga.subtitle && <p className="text-sm text-gray-600">{yuga.subtitle}</p>}
          {yuga.years && <p className="text-sm mt-1">{yuga.years}</p>}
          {Array.isArray(yuga.description) && yuga.description.length > 0 && (
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {yuga.description.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          )}
        </article>
      ))}
    </section>
  );
}
