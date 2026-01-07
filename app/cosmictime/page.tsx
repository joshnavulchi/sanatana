import { t, detectLocale } from '../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../lib/pageUtils';
import PageLayout from "../components/common/PageLayout";
import styles from "./page.module.scss";
export const generateMetadata = createGenerateMetadata('cosmictime');


function formatKey(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value: string) {
  // Format numbers with commas; leave other types as string
  return typeof value === "number"
    ? new Intl.NumberFormat("en-IN").format(value)
    : String(value);
}


export default function Page({ searchParams }: any) {
  const locale = detectLocale(searchParams) || resolveLocaleFromHeaders();
  // Single `page_title` object used across the page: prefers `locales/*/cosmictime.json` values
  const cosmic: any = (() => {
    const k: any = 'cosmictime';
    const arr = (p: any) => {
      if (Array.isArray(p)) return p;
      if (p == null) return [];
      return [String(p)];
    };
    return {
      title: String(t('cosmictime.title', locale) || ''),
      scope: String(t('cosmictime.scope', locale) || ''),
      option3_scientific_comparison: JSON.parse((t("cosmictime.option3_scientific_comparison"))),
      option4_manvantara_explainer: JSON.parse((t("cosmictime.option4_manvantara_explainer"))),
      final_consolidated_insight: JSON.parse((t("cosmictime.final_consolidated_insight")))
    };
  })();
  return (
    <PageLayout
      metaKey="cosmictime"
      title={cosmic.title}
      breadcrumbs={[
        { labelKey: 'nav.home', href: '/' },
        { label: cosmic.title }]}
      className={`${styles.cosmicPage} layout-md`}>
      <p>{cosmic.scope}</p>
      <section>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sanātana Dharma */}
          <div className="flex-1 bg-white rounded shadow p-4 mb-8">
            <ol>
              {Object.entries(cosmic.option3_scientific_comparison).map(([key, value]) => {
                let obj = {};
                if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                  obj = value;
                }
                return (<li key={key}>
                  <strong>{formatKey(key)}: </strong> obj
                </li>);
              })}
            </ol>
          </div>
          {/* Modern Science */}
          <div className="flex-1 bg-white rounded shadow p-4 mb-8">
            <ol>
              {Object.entries(cosmic.option4_manvantara_explainer).map(([key, value]) => {
                let obj = {};
                let arr = [];
                let str = '';
                if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                  obj = value;
                }
                else if (value !== null && Array.isArray(value)) {
                  arr = value;
                }
                else {
                  str = value + ' ';
                }
                return (<li key={key}>
                  <strong>{formatKey(key)}: </strong>
                  {str ? str : null}
                  {arr.length > 0 && arr.map((item, index) => {
                    if (typeof item === 'string') {
                      return item + ', ';
                    }
                    if (typeof item !== null && Array.isArray(item)) {
                      return item.map((item: any) => <span key={item.order}>{item.name}</span>)
                    }
                  })}
                </li>);
              })}
            </ol>
          </div>
        </div>
      </section>
      {/* Final Insight */}
      <div className="bg-white rounded shadow p-4">
        <ol>
          {Object.entries(cosmic.final_consolidated_insight).map(([key, value]) => (
            <li key={key}>
              <span className="description font-semibold!">{formatKey(key)}:</span> {typeof value === 'string' ? value : null}
            </li>
          ))}
        </ol>
      </div>
    </PageLayout>
  );
}