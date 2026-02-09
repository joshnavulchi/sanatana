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
      breadcrumbs={[
        { labelKey: 'Home', href: '/' },
        { label: 'Cosmic Time' }]}
      className={`${styles.cosmicPage} layout-sm`}>
      <p className="description dark:text-amber-100">{cosmic('cosmictime.definition')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.keypoint')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.longduration')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.system')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.scale_of_time')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.human_years')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.cyclical_universe')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.modern_thinking_assumes')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.assumes')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.thus')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.staya_yuga_longest')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.staya_yuga_longest_definition')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.non_contradictory')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.non_contradictory_thus')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.symbolic_structural')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.symbolic_structural_this')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.summary_direct_answer')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.satya_yuga_long_design')}</p>
      <p className="dark:text-amber-100">{cosmic('cosmictime.night_of_brahma')}</p>
      <p className="dark:text-amber-100"><strong>{cosmic('cosmictime.brahma_full_day')}: </strong>{cosmic('cosmictime.lifetime_brahma')}</p>
    </PageLayout>
  );
}
