import Link from 'next/link';
import { DEFAULT_LOCALE, getLocaleNamespaceObject } from '@lib/i18n';

type TopicItem = { id?: string; title?: string; description?: string; href?: string };
type Section = { id?: string; title?: string; content?: string; items?: TopicItem[] };

export default function UnderstandingOfSanatana() {
  const ns = getLocaleNamespaceObject(DEFAULT_LOCALE, 'home') as any;
  const sections = (ns?.home?.sections || ns?.sections || []) as Section[];

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <section key={section.id || sectionIndex} className="rounded-xl border p-5 bg-white">
          <h2 className="h3">{section.title}</h2>
          {section.content && <p className="mt-2">{section.content}</p>}
          {Array.isArray(section.items) && section.items.length > 0 && (
            <div className="mt-3 grid gap-2">
              {section.items.map((item, idx) => (
                <Link key={item.id || idx} href={item.href || '#'} className="text-[#7a2e1f] hover:underline">
                  {item.title || 'Read more'}
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
