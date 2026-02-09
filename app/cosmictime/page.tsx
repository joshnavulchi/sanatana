import { t, detectLocale } from '../../lib/i18n';
import { createGenerateMetadata } from '../../lib/pageUtils';
import PageLayout from "../components/common/PageLayout";
export const generateMetadata = createGenerateMetadata('cosmictime');
import styles from "./page.module.scss";

export default async function Page() {
  const locale = await detectLocale();
  // Single `page_title` object used across the page: prefers `locales/*/cosmictime.json` values
  const cosmic = (k: any) => t(k, locale);
  return (
    <PageLayout
      metaKey="cosmictime"
      title={cosmic('cosmictime.title')}
      breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: 'Cosmic Time' }]}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-amber-50 to-orange-100 py-12 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-amber-700 tracking-tight mb-2 drop-shadow-lg">
            {cosmic('cosmictime.title')}
          </h1>
          <p className="text-lg text-amber-800 font-medium mb-4">
            {cosmic('cosmictime.definition')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-amber-200">
            <h2 className="text-xl font-bold text-orange-700 mb-2">Key Points</h2>
            <ul className="list-disc pl-6 text-amber-900 space-y-2">
              <li>{cosmic('cosmictime.keypoint')}</li>
              <li>{cosmic('cosmictime.longduration')}</li>
              <li>{cosmic('cosmictime.system')}</li>
              <li>{cosmic('cosmictime.scale_of_time')}</li>
              <li>{cosmic('cosmictime.human_years')}</li>
              <li>{cosmic('cosmictime.cyclical_universe')}</li>
            </ul>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-amber-200">
            <h2 className="text-xl font-bold text-orange-700 mb-2">Insights</h2>
            <ul className="list-disc pl-6 text-amber-900 space-y-2">
              <li>{cosmic('cosmictime.modern_thinking_assumes')}</li>
              <li>{cosmic('cosmictime.assumes')}</li>
              <li>{cosmic('cosmictime.thus')}</li>
              <li>{cosmic('cosmictime.staya_yuga_longest')}</li>
              <li>{cosmic('cosmictime.staya_yuga_longest_definition')}</li>
              <li>{cosmic('cosmictime.non_contradictory')}</li>
              <li>{cosmic('cosmictime.non_contradictory_thus')}</li>
              <li>{cosmic('cosmictime.symbolic_structural')}</li>
              <li>{cosmic('cosmictime.symbolic_structural_this')}</li>
              <li>{cosmic('cosmictime.summary_direct_answer')}</li>
              <li>{cosmic('cosmictime.satya_yuga_long_design')}</li>
              <li>{cosmic('cosmictime.night_of_brahma')}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 text-center">
          <div className="inline-block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-xl px-6 py-4 shadow-md">
            <span className="text-lg font-semibold text-white">
              <strong>{cosmic('cosmictime.brahma_full_day')}: </strong>{cosmic('cosmictime.lifetime_brahma')}
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
