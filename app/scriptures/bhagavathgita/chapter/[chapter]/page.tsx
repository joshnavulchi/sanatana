// Pre-render all known Gita chapters so each chapter has its own static page and metadata
import BhagavathgitaChapterClientPage from './chapterclient';

export function generateStaticParams() {
  // Return explicit static params for chapters 1..18 to satisfy `output: "export"` builds.
  return Array.from({ length: 18 }).map((_, i) => ({ chapter: String(i + 1) }));
}

export default function Page(props: any) {
  // Next.js passes params as props.params, but sometimes as just props in dev
  const params = props?.params || props;
  return <BhagavathgitaChapterClientPage params={params} />;
}
