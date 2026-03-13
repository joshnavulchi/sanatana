import PageLayout from '@components/common/PageLayout';
import { DEFAULT_LOCALE, getLocaleNamespaceObject } from '@lib/i18n';
import { parseMaybeObject } from '@lib/parseContent';

type Props = {
  namespace: string;
  metaKey: string;
  breadcrumbLabel: string;
  titleFallback?: string;
  hideKeys?: string[];
};

function normalizeNamespaceObject(namespace: string, raw: any): Record<string, any> {
  const parsed = parseMaybeObject(raw);
  if (!parsed || typeof parsed !== 'object') return {};
  const asRecord = parsed as Record<string, any>;
  if (asRecord[namespace] && typeof asRecord[namespace] === 'object') {
    return asRecord[namespace] as Record<string, any>;
  }
  return asRecord;
}

function renderValue(value: any): React.ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return <p>{String(value)}</p>;
  }
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc pl-6 space-y-2">
        {value.map((item, index) => (
          <li key={index}>{renderValue(item)}</li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object') {
    return (
      <div className="space-y-3">
        {Object.entries(value).map(([key, nested]) => (
          <div key={key}>
            <h3 className="text-base md:text-md font-semibold capitalize">{key.replace(/_/g, ' ')}</h3>
            <div className="mt-1">{renderValue(nested)}</div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function StaticNamespacePage({
  namespace,
  metaKey,
  breadcrumbLabel,
  titleFallback = 'Untitled',
  hideKeys = ['meta', 'metadata', 'schema', 'jsonld'],
}: Props) {
  const ns = getLocaleNamespaceObject(DEFAULT_LOCALE, namespace);
  const data = normalizeNamespaceObject(namespace, ns);
  const title = String(data.title || titleFallback);

  return (
    <PageLayout
      metaKey={metaKey}
      title={title}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: breadcrumbLabel || title }]}
      className="layout-md"
    >
      <div className="space-y-6">
        {Object.entries(data)
          .filter(([key]) => key !== 'title' && !hideKeys.includes(key))
          .map(([key, value]) => (
            <section key={key} className="bg-white rounded-xl border p-5">
              <h2 className="h3 capitalize">{key.replace(/_/g, ' ')}</h2>
              <div className="mt-3">{renderValue(value)}</div>
            </section>
          ))}
      </div>
    </PageLayout>
  );
}
