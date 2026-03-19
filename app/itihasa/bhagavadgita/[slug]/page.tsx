/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import SlugClient from './slugclient';

const VALID_SLUGS = [
  'arjuna-vishada-yoga', 'sankhya-yoga', 'karma-yoga', 'jnana-karma-sanyasa-yoga',
  'karma-sanyasa-yoga', 'dhyana-yoga', 'jnana-vijnana-yoga', 'akshara-brahma-yoga',
  'raja-vidya-raja-guhya-yoga', 'vibhuti-yoga', 'vishvarupa-darshana-yoga', 'bhakti-yoga',
  'kshetra-kshetrajna-vibhaga-yoga', 'gunatraya-vibhaga-yoga', 'purushottama-yoga',
  'daivasura-sampad-vibhaga-yoga', 'shraddhatray-vibhaga-yoga', 'moksha-sanyasa-yoga',
];

import { params as generatedParams } from '@app/generated-params/itihasa-bhagavadgita';

export const dynamicParams = false;

// export async function generateStaticParams() {
//   return VALID_SLUGS
//     .filter((s) => !!s)
//     .map((slug) => ({ slug }));
// }



export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const generate = createGenerateMetadata(`bhagavadgita_${slug}`);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return (
    <>
      <StructuredData metaKey={`bhagavadgita_${slug}`} />
      <SlugClient slug={slug} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
