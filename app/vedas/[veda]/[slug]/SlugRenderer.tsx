import { DEFAULT_LOCALE } from '@lib/i18n';
import PageLayout from '@components/common/PageLayout';

type SlugData = Record<string, any> | null;

export default function SlugRenderer({ initialData, initialLocale, veda, slug }: { initialData?: SlugData; initialLocale?: string; veda: string; slug: string }) {
  const data = initialData;
  const locale = initialLocale || DEFAULT_LOCALE;

  if (!data) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
          <p className="text-gray-600">The requested content could not be loaded.</p>
        </div>
      </PageLayout>
    );
  }

  const hymns = (data as any).hymns || [];

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">{veda} {slug.replace(/book/i, 'Book ')}</h1>
        <div className="prose prose-lg max-w-none">
          {hymns.map((hymn: any, i: number) => (
            <div key={i} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hymn {hymn.hymn_number}: {hymn.theme}</h2>
              {hymn.verses && hymn.verses.map((verse: any, j: number) => (
                <div key={j} className="bg-white/95 p-4 mb-4 rounded-lg shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    {verse.verse_number !== undefined && (
                      <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-lg sm:text-base font-medium">
                        Verse {String(verse.verse_number)}
                      </span>
                    )}
                    {verse.title && <span className="text-lg sm:text-base uppercase tracking-[0.18em] text-gray-500">{verse.title}</span>}
                  </div>
                  {verse.sanskrit && (
                    <p className="text-xl leading-relaxed text-gray-900 mb-3">{verse.sanskrit}</p>
                  )}
                  {verse.transliteration && (
                    <p className="text-base text-gray-700 italic mb-4">{verse.transliteration}</p>
                  )}
                  {verse.meaning && (
                    <div className="space-y-3 mb-4">
                      <div className="text-lg sm:text-base font-semibold uppercase tracking-[0.18em] text-gray-500">Meaning</div>
                      {typeof verse.meaning === 'string' ? (
                        <p className="text-lg leading-relaxed text-red-600">{verse.meaning}</p>
                      ) : (
                        Object.entries(verse.meaning).map(([k, v]) => (
                          <div key={k} className="rounded-xl bg-gray-50 p-3">
                            <div className="text-lg sm:text-base font-semibold text-gray-700 mb-1">{k.replace(/[-_]/g, ' ')}</div>
                            <p className="text-lg sm:text-base leading-relaxed text-gray-600">{String(v)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}