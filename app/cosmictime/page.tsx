import { t, detectLocale } from '../../lib/i18n';
import { resolveLocaleFromHeaders, createGenerateMetadata } from '../../lib/pageUtils';
import PageLayout from "../components/common/PageLayout";
import styles from "./page.module.scss";
export const generateMetadata = createGenerateMetadata('cosmictime');

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
      vision: {
        description: String(t('cosmictime.vision.description', locale) || ''),
        focusAreas: (t('cosmictime.vision.focusAreas', locale) as string[]),
        goal: String(t('cosmictime.vision.goal', locale) || '')
      },
      whyWeCreated: {
        purpose: String(t('cosmictime.whywecreated.purpose', locale) || ''),
        problemsAddressed: (t('cosmictime.whywecreated.problemsaddressed', locale) as string[])
      },
      commitment: (t('cosmictime.commitment', locale) as string[]),
      joinUs: {
        message: String(t('cosmictime.joinus.message', locale) || ''),
        invite: (t('cosmictime.joinus.invite', locale) as string[])
      },
      disclaimer: String(t('cosmictime.disclaimer', locale) || '')
    };
  })();
  return (
    <PageLayout
      metaKey="cosmictime"
      title={cosmic.title}
      breadcrumbs={[
        { labelKey: 'nav.home', href: '/' },
        { label: 'Cosmic Time' }]}
      className={`${styles.cosmicPage} layout-md`}>
    </PageLayout>
  );
}