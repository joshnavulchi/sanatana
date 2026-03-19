"use client";

import PageLayout from '@components/common/PageLayout';
import Loader from '@components/loader';
import { useLocale } from '@app/context/locale-context';
import useLocaleSection from '@app/hooks/useLocaleSection';
import { toTitleFromSlug } from '../../philosophy-utils';
const page = {
  introduc: "Introduction",
  philosop_explanat: "Philosophical Explanation",
  text: "Text"
};

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
export default function PartsClient({
  topic,
  subtopic
}: {
  topic: string;
  subtopic: string;
}) {
  const {
    isLoading
  } = useLocale();
  const namespace = `vedic_philosophy_${topic}_${subtopic}`;
  const data = useLocaleSection(namespace);
  const title = typeof data?.title === 'string' ? data.title : `${toTitleFromSlug(topic)} - ${toTitleFromSlug(subtopic)}`;
  const description = typeof data?.description === 'string' ? data.description : '';
  const introduction = typeof data?.introduction === 'string' ? data.introduction : '';
  const scriptureText = typeof data?.scripture_text === 'string' ? data.scripture_text : '';
  const philosophical = typeof data?.philosophical_explanation === 'string' ? data.philosophical_explanation : '';
  if (isLoading && !title) {
    return <PageLayout metaKey={namespace} title="" breadcrumbs={[{
      label: 'Home',
      href: '/'
    }, {
      label: 'Vedic Philosophy',
      href: '/vedic-philosophy'
    }, {
      label: toTitleFromSlug(topic),
      href: `/vedic-philosophy/${topic}`
    }, {
      label: toTitleFromSlug(subtopic)
    }]} className="layout-md">
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>;
  }
  return <PageLayout metaKey={namespace} title={title} breadcrumbs={[{
    label: 'Home',
    href: '/'
  }, {
    label: 'Vedic Philosophy',
    href: '/vedic-philosophy'
  }, {
    label: toTitleFromSlug(topic),
    href: `/vedic-philosophy/${topic}`
  }, {
    label: toTitleFromSlug(subtopic)
  }]} className="layout-md">
      <section className="rounded-3xl border border-[#d8a25a]/30 bg-linear-to-br from-[#fffaf3] via-[#fdf0d7] to-[#fff8ef] p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#3d2e22] mb-2">{title}</h1>
        {description && <p className="text-base text-[#6b5d4f]">{description}</p>}
      </section>

      {introduction && <section className="mt-6 rounded-2xl border border-[#d8a25a]/30 bg-[#fffaf3] p-5 md:p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#a89278] mb-3"> {page.introduc} </h2>
          <div className="text-base text-[#5b2d12] leading-relaxed">
            <Paragraphs text={introduction} />
          </div>
        </section>}

      {scriptureText && <section className="mt-6 rounded-2xl border border-[#edc98f]/50 bg-[#fffaf3] p-5 md:p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#a89278] mb-3"> {page.text} </h2>
          <div className="text-base text-[#5b2d12] leading-relaxed">
            <Paragraphs text={scriptureText} />
          </div>
        </section>}

      {philosophical && <section className="mt-6 rounded-2xl border border-[#e0a632]/30 bg-[#fffaf3] p-5 md:p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#a89278] mb-3"> {page.philosop_explanat} </h2>
          <div className="text-base text-[#5b2d12] leading-relaxed">
            <Paragraphs text={philosophical} />
          </div>
        </section>}
    </PageLayout>;
}