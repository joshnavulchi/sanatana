export const revalidate = 60;
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { createGenerateMetadata } from '@lib/pageUtils';
import StructuredData from '@components/structured-data/StructuredData';
import SlugClient from './slugclient';
import { params as generatedParams } from '@app/generated-params/itihasa-ramayana';

const VALID_SLUGS = [
  'bala-kanda', 'ayodhya-kanda', 'aranya-kanda', 'kishkinda-kanda',
  'sundara-kanda', 'yuddha-kanda', 'uttara-kanda',
];

export const dynamicParams = false;

export async function generateStaticParams() {
  // Return the build-time generated params to include all Ramayana kanda pages.
  return generatedParams;
}



export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const generate = createGenerateMetadata(`itihasa_ramayana_${slug}`);
  return generate({});
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return (
    <>
      <StructuredData metaKey={`itihasa_ramayana_${slug}`} />
      <SlugClient slug={slug} />
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
