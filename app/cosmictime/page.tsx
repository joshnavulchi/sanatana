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
        { labelKey: 'nav.home', href: '/' },
        { label: 'Cosmic Time' }]}
      className={`${styles.cosmicPage} layout-md`}>
      <p className="description">{cosmic('cosmictime.definition')}</p>
      <p>{cosmic('cosmictime.keypoint')}</p>
      <p>{cosmic('cosmictime.longduration')}</p>
      <p>{cosmic('cosmictime.system')}</p>
      <p>{cosmic('cosmictime.scale_of_time')}</p>
      <p>{cosmic('cosmictime.human_years')}</p>
      <p>{cosmic('cosmictime.cyclical_universe')}</p>
      <p>{cosmic('cosmictime.modern_thinking_assumes')}</p>
      <p>{cosmic('cosmictime.assumes')}</p>
      <p>{cosmic('cosmictime.thus')}</p>
      <p>{cosmic('cosmictime.staya_yuga_longest')}</p>
      <p>{cosmic('cosmictime.staya_yuga_longest_definition')}</p>
      <p>{cosmic('cosmictime.non_contradictory')}</p>
      <p>{cosmic('cosmictime.non_contradictory_thus')}</p>
      <p>{cosmic('cosmictime.symbolic_structural')}</p>
      <p>{cosmic('cosmictime.symbolic_structural_this')}</p>
      <p>{cosmic('cosmictime.summary_direct_answer')}</p>
      <p>{cosmic('cosmictime.satya_yuga_long_design')}</p>
      <p>{cosmic('cosmictime.night_of_brahma')}</p>
      <p><strong>{cosmic('cosmictime.brahma_full_day')}: </strong>{cosmic('cosmictime.lifetime_brahma')}</p>
    </PageLayout>
  );
}
