/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import SlugClient from './slugclient';
import StructuredData from '@/app/components/structured-data/StructuredData';

const VALID_SLUGS = ['rigveda', 'yajurveda', 'samaveda', 'atharvaveda'];

/* Map URL slug → locale file key (filename without .json) */
const FILE_MAP: Record<string, string> = {
  rigveda: 'vedas_rigveda',
  yajurveda: 'vedas_yajurveda',
  samaveda: 'vedas_samaveda',
  atharvaveda: 'vedas_atharvaveda',
};

import { params as generatedParams } from '@app/generated-params/vedas-slugs';

export const dynamicParams = false;

// export async function generateStaticParams() {
//   return VALID_SLUGS
//     .filter((s) => !!s)
//     .map((slug) => ({ slug }));
// }



export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const fileKey = FILE_MAP[slug] || slug;
  const generate = createGenerateMetadata(fileKey);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return (
    <>
      <StructuredData metaKey={`vedas_${slug}`} />
      <SlugClient slug={slug} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */