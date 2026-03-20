"use client";

import Link from 'next/link';
import PageLayout from '@components/common/PageLayout';
import Loader from '@components/loader';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
const page = {
  introduc: "Introduction",
  philosop_explanat: "Philosophical Explanation",
  text: "Text"
};

interface Breadcrumb {
  label: string;
  href?: string;
}
function Paragraphs({
  text
}: {
  text: string;
}) {
  return <>
      {text.split('\n\n').map((paragraph, index) => <p key={index} className="mb-4 last:mb-0">
          {paragraph}
        </p>)}
    </>;
}
export default function ItihasaPartClient({
  namespace,
  titleFallback,
  breadcrumbs,
  nextHref,
  nextLabel
}: {
  namespace: string;
  titleFallback: string;
  breadcrumbs: Breadcrumb[];
  nextHref?: string;
  nextLabel?: string;
}) {
  const {
    isLoading
  } = useLocale();
  const data = useLocaleSection(namespace);
  const title = typeof data?.title === 'string' ? data.title : titleFallback;
  const description = typeof data?.description === 'string' ? data.description : '';
  const introduction = typeof data?.introduction === 'string' ? data.introduction : '';
  const scriptureText = typeof data?.scripture_text === 'string' ? data.scripture_text : '';
  const philosophical = typeof data?.philosophical_explanation === 'string' ? data.philosophical_explanation : '';
  if (isLoading && !title) {
    return <PageLayout metaKey={namespace} title="" breadcrumbs={breadcrumbs} className="layout-md">
        <div className="flex items-center justify-center py-6">
          <Loader />
        </div>
      </PageLayout>;
  }
  return <PageLayout metaKey={namespace} title={title} breadcrumbs={breadcrumbs} className="layout-md">
      <section className="rounded-3xl border border-[#d8a25a]/30 bg-linear-to-br from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] p-4 md:p-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#3d2e22] mb-2">{title}</h1>
        {description && <p className="text-base text-[#6b5d4f]">{description}</p>}
      </section>

      {introduction && <section className="mt-6 rounded-2xl border border-[#d8a25a]/30 bg-[#fffaf3] p-4 md:p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#a89278] mb-3"> {page.introduc} </h2>
          <div className="text-base text-[#5b2d12] leading-relaxed">
            <Paragraphs text={introduction} />
          </div>
        </section>}

      {scriptureText && <section className="mt-6 rounded-2xl border border-[#edc98f]/50 bg-[#fffaf3] p-4 md:p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#a89278] mb-3"> {page.text} </h2>
          <div className="text-base text-[#5b2d12] leading-relaxed">
            <Paragraphs text={scriptureText} />
          </div>
        </section>}

      {philosophical && <section className="mt-6 rounded-2xl border border-[#e0a632]/30 bg-[#fffaf3] p-4 md:p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#a89278] mb-3"> {page.philosop_explanat} </h2>
          <div className="text-base text-[#5b2d12] leading-relaxed">
            <Paragraphs text={philosophical} />
          </div>
        </section>}

      {nextHref && <nav className="mt-8 flex justify-end">
          <Link href={nextHref} className="text-sm font-semibold text-[#7a2e1f] hover:text-[#92400e]">
            {nextLabel || 'Open next'} →
          </Link>
        </nav>}
    </PageLayout>;
}