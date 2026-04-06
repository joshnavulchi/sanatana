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

  function Paragraph({ children }: any) {
    return <p className="text-lg leading-relaxed text-red-600">{children}</p>;
  }

  function isVerseRecord(value: any): value is Record<string, any> {
    return value && typeof value === 'object' && (
      ('sanskrit' in value || 'transliteration' in value || 'meaning' in value) ||
      ('verse_number' in value && (('sanskrit' in value) || ('transliteration' in value) || ('meaning' in value)))
    );
  }

  function renderVerse(verse: Record<string, any>) {
    return (
      <div className="bg-white/95 p-4">
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
              <Paragraph>{verse.meaning}</Paragraph>
            ) : (
              Object.entries(verse.meaning).map(([k, v]) => (
                <div key={k} className="rounded-xl bg-gray-50">
                  <div className="text-lg sm:text-base font-semibold text-gray-700 mb-1">{k.replace(/[-_]/g, ' ')}</div>
                  <p className="text-lg sm:text-base leading-relaxed text-gray-600">{String(v)}</p>
                </div>
              ))
            )}
          </div>
        )}
        {verse.entities && (
          <div className="space-y-2 mb-3">
            {Object.entries(verse.entities).map(([key, value]) => (
              <div key={key}>
                <div className="text-lg sm:text-base font-semibold text-gray-700">{key.replace(/[-_]/g, ' ')}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-lg sm:text-base text-gray-600">
                  {Array.isArray(value) ? value.map((item: any, idx: number) => (
                    <span key={idx} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1">{String(item)}</span>
                  )) : <span>{String(value)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function RenderValue({ value }: { value: any }) {
    if (value === null || value === undefined) return null;

    if (Array.isArray(value)) {
      if (value.every((v) => typeof v === 'string' || typeof v === 'number')) {
        return (
          <div className="flex flex-wrap gap-2">
            {value.map((v, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-lg sm:text-base">{String(v)}</span>
            ))}
          </div>
        );
      }

      if (value.every(isVerseRecord)) {
        return (
          <div className="space-y-5">
            {value.map((item, i) => (
              <div key={i}>{renderVerse(item)}</div>
            ))}
          </div>
        );
      }

      return (
        <div className="space-y-3">
          {value.map((item, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <RenderValue value={item} />
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      if (isVerseRecord(value)) {
        return renderVerse(value);
      }

      return (
        <div className="space-y-4">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="border-l-4 border-indigo-200 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{k.replace(/[-_]/g, ' ')}</h3>
              <RenderValue value={v} />
            </div>
          ))}
        </div>
      );
    }

    return <Paragraph>{String(value)}</Paragraph>;
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">{veda} {slug.replace(/book/i, 'Book ')}</h1>
        <div className="prose prose-lg max-w-none">
          <RenderValue value={data} />
        </div>
      </div>
    </PageLayout>
  );
}